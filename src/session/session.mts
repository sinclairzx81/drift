/*--------------------------------------------------------------------------

@sinclair/drift

The MIT License (MIT)

Copyright (c) 2022 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import { DevToolsInterface, DevToolsAdapter } from '../devtools/index.mjs'
import { Events, EventListener, EventHandler } from '../events/index.mjs'
import { ValueResolver } from './values.mjs'
import { Color } from '../color/index.mjs'
import { Repl } from '../repl/index.mjs'
import { Barrier } from '../async/index.mjs'
import { Build } from '../build/index.mjs'

import * as Path from 'node:path'
import * as Fs from 'node:fs'

// ------------------------------------------------------------------------
// Error
// ------------------------------------------------------------------------

export class Exception extends Error {
  public lineNumber: number
  public columnNumber: number
  public text: string
  constructor(exceptionDetails: DevToolsInterface.Runtime.ExceptionDetails) {
    super(exceptionDetails.exception?.description)
    this.lineNumber = exceptionDetails.lineNumber
    this.columnNumber = exceptionDetails.columnNumber
    this.text = exceptionDetails.text
  }
}

// ------------------------------------------------------------------------
// Session
// ------------------------------------------------------------------------

export class Session {
  readonly #resolver: ValueResolver
  readonly #devtools: DevToolsInterface.DevTools
  readonly #repl: Repl
  readonly #events: Events
  readonly #ready: Barrier

  constructor(websocketDebuggerEndpoint: string, repl: Repl) {
    this.#repl = repl
    this.#devtools = new DevToolsInterface.DevTools(new DevToolsAdapter(websocketDebuggerEndpoint))
    this.#resolver = new ValueResolver(this.#devtools)
    this.#events = new Events()
    this.#ready = new Barrier(true)
    this.#setup().catch((error) => console.error(error))
  }

  /** Subscribes once to exit calls made from the page */
  public on(event: 'close', handler: EventHandler<number>): EventListener
  /** Subscribes once to unhandled errors occuring in the page */
  public on(event: 'error', handler: EventHandler<Exception | null>): EventListener
  /** Subscribes once to events */
  public on(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.once(event, handler)
  }

  // ---------------------------------------------------------------
  // Setup
  // ---------------------------------------------------------------

  async #setup() {
    this.#devtools.Runtime.on('executionContextCreated', (event) => this.#onExecutionContextCreated(event))
    this.#devtools.Runtime.on('executionContextDestroyed', (event) => this.#onExecutionContextDestroyed(event))
    this.#devtools.Runtime.on('consoleAPICalled', (event) => this.#onConsoleApiCalled(event))
    this.#devtools.Runtime.on('exceptionThrown', (event) => this.#onExceptionThrown(event))
    this.#devtools.Page.on('loadEventFired', (event) => this.#onLoadEventFired(event))
    await this.#devtools.Network.enable({})
    await this.#devtools.Runtime.enable({})
    await this.#devtools.Page.enable({})
    this.#ready.resume()
  }

  // ---------------------------------------------------------------
  // Interface
  // ---------------------------------------------------------------

  public async evaluate(expression: string): Promise<unknown> {
    await this.#ready.wait()

    const result = await this.#devtools.Runtime.evaluate({ expression })
    if (result.exceptionDetails) {
      return this.#handleError(result.exceptionDetails)
    }

    // -----------------------------------------------------------------------
    // If the expression looks like a console call, we need defer writing to
    // the console and allow the event consoleAPICalled time to fire. This
    // allows Drift to emit console messages in the same order as Node.
    // ----------------------------------------------------------------------

    const value = await this.#resolver.resolve(result.result)
    const regex = /console\.((log)|(warn)|(table)|(error))\([^\)]*\)/
    return regex.test(expression)
      ? setTimeout(() => this.#consoleLog(value), 50) // consoleAPICalled first
      : this.#consoleLog(value)
  }

  public async run(path: string): Promise<void> {
    await this.#ready.wait()
    if (!Fs.existsSync(path)) return this.#consoleError(`run: file '${path}' not found`)
    const expression = `(async function() { ${Build.build(path)} })();`
    const compileResult = await this.#devtools.Runtime.compileScript({ expression, persistScript: true, sourceURL: 'module.esm' })
    if (compileResult.exceptionDetails) {
      this.#handleError(compileResult.exceptionDetails)
      return
    }
    await this.#devtools.Runtime.runScript({ scriptId: compileResult.scriptId!, awaitPromise: true })
  }

  public async css(path: string): Promise<void> {
    await this.#ready.wait()
    if (!Fs.existsSync(path)) return this.#consoleError(`css: file '${path}' not found`)
    const expression = `document.head.insertAdjacentHTML("beforeend", \`\n<style>\n${Build.build(path)}</style>\`)`
    const compileResult = await this.#devtools.Runtime.compileScript({ expression, persistScript: true, sourceURL: 'module.esm' })
    if (compileResult.exceptionDetails) {
      this.#handleError(compileResult.exceptionDetails)
      return
    }
    await this.#devtools.Runtime.runScript({ scriptId: compileResult.scriptId!, awaitPromise: true })
  }

  public async position(x: number, y: number) {
    await this.#ready.wait()
    const target = await this.#devtools.Browser.getWindowForTarget({})
    await this.#devtools.Browser.setWindowBounds({
      windowId: target.windowId,
      bounds: { left: Math.floor(x), top: Math.floor(y), windowState: 'normal' },
    })
  }

  public async size(w: number, h: number) {
    await this.#ready.wait()
    const [width, height] = [Math.floor(w), Math.floor(h)]
    const viewport: DevToolsInterface.Page.Viewport = { scale: 1, x: 0, y: 0, width, height }
    const target = await this.#devtools.Browser.getWindowForTarget({})
    await this.#devtools.Browser.setWindowBounds({
      windowId: target.windowId,
      bounds: { width, height, windowState: 'normal' },
    })
    await this.#devtools.Emulation.setDeviceMetricsOverride({
      width,
      height,
      scale: 1,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: width,
      screenHeight: height,
      viewport,
    })
  }

  public async url(url: string): Promise<void> {
    await this.#ready.wait()
    await this.#devtools.Page.navigate({ url })
    this.#ready.pause()
  }

  public async save(path: string): Promise<void> {
    await this.#ready.wait()
    const target = Path.resolve(path)
    this.#ensureDirectoryExists(Path.dirname(target))
    const format = this.#imageFormat(target)
    switch (format) {
      case 'jpeg':
        return await this.#saveImage(target, format)
      case 'png':
        return await this.#saveImage(target, format)
      case 'pdf':
        return await this.#savePdf(target)
      default:
        return this.#consoleError('save: only .png, .jpg and .pdf formats are supported.')
    }
  }

  public async click(x: number, y: number) {
    function toButtonsMask(buttons: string[]): number {
      let mask = 0
      if (buttons.includes('left')) mask |= 1
      if (buttons.includes('right')) mask |= 2
      if (buttons.includes('middle')) mask |= 4
      return mask
    }
    await this.#ready.wait()
    await this.#devtools.Input.dispatchMouseEvent({
      type: 'mousePressed',
      timestamp: Date.now(),
      button: 'right',
      deltaX: 0,
      deltaY: 0,
      pointerType: 'mouse',
      buttons: toButtonsMask(['left']),
      x: x,
      y: y,
    })
  }
  // ---------------------------------------------------------------
  // Image
  // ---------------------------------------------------------------

  #ensureDirectoryExists(path: string) {
    Fs.mkdirSync(path, { recursive: true })
  }

  #imageFormat(path: string): 'jpeg' | 'png' | 'pdf' | 'unknown' {
    const target = Path.resolve(path)
    Fs.mkdirSync(Path.dirname(path), { recursive: true })
    const extname = Path.extname(target)
    if (['.jpg', '.jpeg'].includes(extname)) return 'jpeg'
    if (['.png'].includes(extname)) return 'png'
    if (['.pdf'].includes(extname)) return 'pdf'
    return 'unknown'
  }

  async #saveImage(path: string, format: 'png' | 'jpeg'): Promise<void> {
    const result = await this.#devtools.Page.captureScreenshot({ format })
    const buffer = Buffer.from(result.data, 'base64')
    await Fs.writeFileSync(path, buffer)
  }

  async #savePdf(path: string): Promise<void> {
    const result = await this.#devtools.Page.printToPDF({})
    const buffer = Buffer.from(result.data, 'base64')
    Fs.writeFileSync(path, buffer)
  }

  // ---------------------------------------------------------------
  // Console Output
  // ---------------------------------------------------------------

  #consoleLog(...args: any[]) {
    this.#repl.disable()
    console.log(...args)
    this.#repl.enable()
  }

  #consoleTable(...args: any[]) {
    this.#repl.disable()
    console.table(...args)
    this.#repl.enable()
  }

  #consoleError(...args: any[]) {
    this.#repl.disable()
    console.log(Color.red, ...args, Color.esc)
    this.#repl.enable()
  }

  #consoleClear() {
    this.#repl.disable()
    console.clear()
    this.#repl.enable()
  }

  // ---------------------------------------------------------------
  // Asserts
  // ---------------------------------------------------------------

  #isNumber(value: unknown): value is number {
    return typeof value === 'number'
  }

  #isString(value: unknown): value is string {
    return typeof value === 'string'
  }

  // ---------------------------------------------------------------
  // Error Handling
  // ---------------------------------------------------------------

  #handleError(exceptionDetails: DevToolsInterface.Runtime.ExceptionDetails) {
    const exception = new Exception(exceptionDetails)
    this.#consoleError(exception)
    this.#events.send('error', exception)
  }

  // ---------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------

  async #onExecutionContextCreated(event: DevToolsInterface.Runtime.ExecutionContextCreatedEvent) {
    // Execution context create signals the browser has entered a new website / page.
    const history = await this.#devtools.Page.getNavigationHistory({})
    const current = history.entries[history.entries.length - 1]
    if (new URL(current.url).origin === event.context.origin) {
      this.#consoleLog(Color.Gray('drift'), current.url)
    }
    // Augment window.* with drift commands
    const expressions = [
      'window.close    = function(code = 0) { console.log("<<close>>", code) }',
      'window.url      = function(endpoint) { console.log("<<url>>", endpoint) }',
      'window.run      = function(path)     { console.log("<<run>>", path) }',
      'window.css      = function(path)     { console.log("<<css>>", path) }',
      'window.position = function(x, y)     { console.log("<<position>>", x, y) }',
      'window.size     = function(w, h)     { console.log("<<size>>", w, h) }',
      'window.click    = function(x, y)     { console.log("<<click>>", x, y) }',
      'window.save     = function(path)     { console.log("<<save>>", path) }',
    ]
    for (const expression of expressions) {
      await this.#devtools.Runtime.evaluate({ contextId: event.context.id, expression })
    }

    this.#ready.resume()
  }

  async #onExecutionContextDestroyed(event: DevToolsInterface.Runtime.ExecutionContextDestroyedEvent) {
    // todo: not implemented
  }

  async #onLoadEventFired(event: DevToolsInterface.Page.LoadEventFiredEvent) {
    // note: not implemented
  }

  async #onConsoleApiCalled(event: DevToolsInterface.Runtime.ConsoleAPICalledEvent) {
    // Intercept '<<command>>' messages and dispatch accordingly
    const args = await Promise.all(event.args.map((arg) => this.#resolver.resolve(arg)))
    if (args.length === 2 && args[0] === '<<close>>') {
      return this.#events.send('close', args[1] === undefined ? 0 : args[1])
    } else if (args.length === 2 && args[0] === '<<run>>' && this.#isString(args[1])) {
      return await this.run(args[1])
    } else if (args.length === 2 && args[0] === '<<css>>' && this.#isString(args[1])) {
      return await this.css(args[1])
    } else if (args.length === 2 && args[0] === '<<url>>' && this.#isString(args[1])) {
      return await this.url(args[1])
    } else if (args.length === 2 && args[0] === '<<save>>' && this.#isString(args[1])) {
      return await this.save(args[1])
    } else if (args.length === 3 && args[0] === '<<size>>' && this.#isNumber(args[1]) && this.#isNumber(args[2])) {
      return await this.size(args[1], args[2])
    } else if (args.length === 3 && args[0] === '<<position>>' && this.#isNumber(args[1]) && this.#isNumber(args[2])) {
      return await this.position(args[1], args[2])
    } else if (args.length === 3 && args[0] === '<<click>>' && this.#isNumber(args[1]) && this.#isNumber(args[2])) {
      return await this.click(args[1], args[2])
    } else {
    }

    // Process console logs as normal
    switch (event.type) {
      case 'clear':
        return this.#consoleClear()
      case 'table':
        return this.#consoleTable(...args)
      case 'error':
        return this.#consoleError(...args)
      default:
        return this.#consoleLog(...args)
    }
  }

  #onExceptionThrown(event: DevToolsInterface.Runtime.ExceptionThrownEvent) {
    this.#handleError(event.exceptionDetails)
  }
}
