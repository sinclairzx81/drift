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
import { Barrier, Semaphore } from '../async/index.mjs'
import { Compiler } from '../build/index.mjs'

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

export interface SessionOptions {
  webSocketDebuggerUrl: string
  args: string[]
}

export class Session {
  readonly #options: SessionOptions
  readonly #devtools: DevToolsInterface.DevTools
  readonly #resolver: ValueResolver
  readonly #repl: Repl
  readonly #semaphore: Semaphore
  readonly #events: Events
  readonly #ready: Barrier

  constructor(repl: Repl, options: SessionOptions) {
    this.#options = options
    this.#devtools = new DevToolsInterface.DevTools(new DevToolsAdapter(this.#options.webSocketDebuggerUrl))
    this.#resolver = new ValueResolver(this.#devtools)
    this.#repl = repl
    this.#semaphore = new Semaphore(1)
    this.#events = new Events()
    this.#ready = new Barrier(true)
    this.#setup().catch((error) => console.error(error))
  }

  /** Subscribes to reload calls made from the page */
  public on(event: 'reload', handler: EventHandler<void>): EventListener
  /** Subscribes once to exit calls made from the page */
  public on(event: 'close', handler: EventHandler<number>): EventListener
  /** Subscribes once to unhandled errors occuring in the page */
  public on(event: 'error', handler: EventHandler<Exception | null>): EventListener
  /** Subscribes once to events */
  public on(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.on(event, handler)
  }

  // --------------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------------

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

  // --------------------------------------------------------------------
  // Session Interface
  // --------------------------------------------------------------------

  public async reload() {
    await this.#ready.wait()
    this.#ready.pause()
    const result = await this.#devtools.Runtime.evaluate({ expression: `window.location.reload()` })
    if (result.exceptionDetails) {
      return this.#handleError(result.exceptionDetails)
    }
  }
  
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
    const regex = /console\.((log)|(warn)|(error)|(table))\([^\)]*\)/
    return regex.test(expression)
      ? setTimeout(() => this.#consoleLog(value), 50) // consoleAPICalled first
      : this.#consoleLog(value)
  }

  public async run(path: string): Promise<void> {
    await this.#ready.wait()
    if (!Fs.existsSync(path)) return this.#consoleError(`run: file '${path}' not found`)
    const code = await Compiler.build(path)
    const encoded = this.#encodeScript(code)
    const expression = [
      '(function() {',
      '  const script = document.createElement("script")',
      '  script.type = "module"',
      `  script.innerHTML = atob('${encoded}')`,
      '  document.head.appendChild(script)',
      '})();',
    ].join('\n')
    const result = await this.#devtools.Runtime.evaluate({ expression })
    if (result.exceptionDetails) {
      return this.#handleError(result.exceptionDetails)
    }
  }

  public async css(path: string): Promise<void> {
    await this.#ready.wait()
    if (!Fs.existsSync(path)) return this.#consoleError(`css: file '${path}' not found`)
    const expression = 'document.head.insertAdjacentHTML("beforeend", `<style>\n' + (await Compiler.build(path)) + '</style>\n`)'
    const result = await this.#devtools.Runtime.evaluate({ expression })
    if (result.exceptionDetails) {
      return this.#handleError(result.exceptionDetails)
    }
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

  public async mousedown(x: number, y: number) {
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

  // --------------------------------------------------------------------
  // Encoding
  // --------------------------------------------------------------------

  #encodeArgs(): string {
    const args = this.#options.args.map((arg) => `"${arg}"`).join(', ')
    return `[${args}]`
  }

  #encodeScript(code: string) {
    return Buffer.from(code).toString('base64')
  }

  // --------------------------------------------------------------------
  // Imaging
  // --------------------------------------------------------------------

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
    try {
      const result = await this.#devtools.Page.captureScreenshot({ format })
      const buffer = Buffer.from(result.data, 'base64')
      Fs.writeFileSync(path, buffer)
    } catch (error) {
      if (error instanceof Error) return this.#consoleError('save:', error.message)
      return this.#consoleError('save: unknown error')
    }
  }

  async #savePdf(path: string): Promise<void> {
    try {
      const result = await this.#devtools.Page.printToPDF({})
      const buffer = Buffer.from(result.data, 'base64')
      Fs.writeFileSync(path, buffer)
    } catch (error) {
      if (error instanceof Error) return this.#consoleError('save:', error.message)
      return this.#consoleError('save: unknown error')
    }
  }

  // --------------------------------------------------------------------
  // Console Logging
  // --------------------------------------------------------------------

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

  // --------------------------------------------------------------------
  // Asserts
  // --------------------------------------------------------------------

  #isNumber(value: unknown): value is number {
    return typeof value === 'number'
  }

  #isString(value: unknown): value is string {
    return typeof value === 'string'
  }

  // --------------------------------------------------------------------
  // Error Handling
  // --------------------------------------------------------------------

  #handleError(exceptionDetails: DevToolsInterface.Runtime.ExceptionDetails) {
    const exception = new Exception(exceptionDetails)
    this.#consoleError(exception)
    this.#events.send('error', exception)
  }

  // --------------------------------------------------------------------
  // Events
  // --------------------------------------------------------------------

  async #onExecutionContextCreated(event: DevToolsInterface.Runtime.ExecutionContextCreatedEvent) {
    // Execution context create signals the browser has entered a new website / page.
    const history = await this.#devtools.Page.getNavigationHistory({})
    const current = history.entries[history.entries.length - 1]
    if (new URL(current.url).origin === event.context.origin) {
      this.#consoleLog(Color.Gray('drift'), current.url)
    }
    // Augment window.* with drift commands
    const expression = [
      'window.close = function(code = 0) { console.log("<<close>>", code) }',
      'window.Drift = {',
      `  args:     ${this.#encodeArgs()},`,
      '  wait:     function(ms = 0)   { return new Promise(resolve => setTimeout(resolve, ms)) },',
      '  close:    function(code = 0) { console.log("<<close>>", code) },',
      '  reload:   function()         { console.log("<<reload>>") },',
      '  url:      function(endpoint) { console.log("<<url>>", endpoint) },',
      '  run:      function(path)     { console.log("<<run>>", path) },',
      '  css:      function(path)     { console.log("<<css>>", path) },',
      '  position: function(x, y)     { console.log("<<position>>", x, y) },',
      '  size:     function(w, h)     { console.log("<<size>>", w, h) },',
      '  click:    function(x, y)     { console.log("<<click>>", x, y) },',
      '  save:     function(path)     { console.log("<<save>>", path) }',
      '}',
    ].join('\n')
    await this.#devtools.Runtime.evaluate({ contextId: event.context.id, expression })
    this.#ready.resume()
  }

  async #onExecutionContextDestroyed(event: DevToolsInterface.Runtime.ExecutionContextDestroyedEvent) {
    // todo: not implemented
  }

  async #onLoadEventFired(event: DevToolsInterface.Page.LoadEventFiredEvent) {
    // note: not implemented
  }

  async #onConsoleApiCalled(event: DevToolsInterface.Runtime.ConsoleAPICalledEvent) {
    await this.#semaphore.run(async () => {
      // Intercept '<<command>>' messages and dispatch accordingly
      const args = await Promise.all(event.args.map((arg) => this.#resolver.resolve(arg)))
      if (args.length === 1 && args[0] === '<<reload>>') {
        return this.#events.send('reload', void 0) // exterior emit to allow script/css reload
      } else if (args.length === 2 && args[0] === '<<close>>') {
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
        return await this.mousedown(args[1], args[2])
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
    })
  }

  async #onExceptionThrown(event: DevToolsInterface.Runtime.ExceptionThrownEvent) {
    return await this.#semaphore.run(() => this.#handleError(event.exceptionDetails))
  }
}
