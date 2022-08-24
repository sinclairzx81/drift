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
import { Color } from '../colors/index.mjs'
import { Repl } from '../repl/index.mjs'
import { Barrier } from '../async/index.mjs'

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
// Context
// ------------------------------------------------------------------------

export class Session {
  readonly #resolver: ValueResolver
  readonly #devtools: DevToolsInterface.DevTools
  readonly #contexts: Map<number, string>
  readonly #repl: Repl
  readonly #events: Events
  readonly #barrier: Barrier

  constructor(endpoint: string, repl: Repl) {
    this.#devtools = new DevToolsInterface.DevTools(new DevToolsAdapter(endpoint))
    this.#repl = repl
    this.#resolver = new ValueResolver(this.#devtools)
    this.#contexts = new Map<number, string>()
    this.#events = new Events()
    this.#barrier = new Barrier(true)
    this.setup().catch((error) => console.error(error))
  }

  /** Gets this contexts devtools instance */
  public get devtools() {
    return this.#devtools
  }

  /** Subscribes once to exit calls made from the page */
  public once(event: 'exit', handler: EventHandler<number>): EventListener
  /** Subscribes once to unhandled errors occuring in the page */
  public once(event: 'error', handler: EventHandler<Exception | null>): EventListener
  /** Subscribes once to events */
  public once(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.once(event, handler)
  }

  /** Subscribes to exit calls made from the page */
  public on(event: 'exit', handler: EventHandler<number>): EventListener
  /** Subscribes to unhandled errors occuring in the page */
  public on(event: 'error', handler: EventHandler<Exception | null>): EventListener
  /** Subscribes to events */
  public on(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.once(event, handler)
  }

  /** Initializes the session */
  private async setup() {
    this.#devtools.Runtime.on('executionContextCreated', (event) => this.onExecutionContextCreated(event))
    this.#devtools.Runtime.on('executionContextDestroyed', (event) => this.onExecutionContextDestroyed(event))
    this.#devtools.Runtime.on('consoleAPICalled', (event) => this.onConsoleApiCalled(event))
    this.#devtools.Runtime.on('exceptionThrown', (event) => this.onExceptionThrown(event))
    await this.#devtools.Network.enable({})
    await this.#devtools.Runtime.enable({})
    await this.#devtools.Page.enable({})
    await this.viewport(1920, 1080)
    this.#barrier.resume()
  }

  /** Sets the window size */
  public async viewport(width: number, height: number) {
    await this.#barrier.wait()
    const viewport: DevToolsInterface.Page.Viewport = { scale: 1, x: 0, y: 0, width, height }
    await this.#devtools.Emulation.setDeviceMetricsOverride({ width, height, deviceScaleFactor: 1, mobile: false, screenWidth: width, screenHeight: height, viewport })
  }

  /** Navigates the page to the given url */
  public async navigate(url: string): Promise<void> {
    await this.#barrier.wait()
    await this.#devtools.Page.navigate({ url })
    this.#barrier.pause()
  }

  /** Captures a image screenshot of the current page */
  public async image(format: 'png' | 'jpeg'): Promise<Uint8Array> {
    await this.#barrier.wait()
    const result = await this.#devtools.Page.captureScreenshot({ format })
    return Buffer.from(result.data, 'base64')
  }

  /** Captures a pdf of the current page */
  public async pdf(): Promise<Uint8Array> {
    await this.#barrier.wait()
    const result = await this.#devtools.Page.printToPDF({})
    return Buffer.from(result.data, 'base64')
  }

  /** Send a synthetic mousedown event to the page */
  public async click(x: number, y: number) {
    function toButtonsMask(buttons: string[]): number {
      let mask = 0
      if (buttons.includes('left')) mask |= 1
      if (buttons.includes('right')) mask |= 2
      if (buttons.includes('middle')) mask |= 4
      return mask
    }
    await this.#barrier.wait()
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

  /** Runs the given script into the page */
  public async run(code: string): Promise<void> {
    await this.#barrier.wait()
    const expression = `(async function () { ${code} })();`
    const result = await this.#devtools.Runtime.evaluate({ expression })
    if (result.exceptionDetails) {
      return this.onExceptionThrown({
        exceptionDetails: result.exceptionDetails,
        timestamp: Date.now(),
      })
    }
  }

  /** Evaluates the given expression in the current page */
  public async evaluate(expression: string): Promise<void> {
    await this.#barrier.wait()
    const result = await this.#devtools.Runtime.evaluate({ expression })
    if (result.exceptionDetails) {
      return this.onExceptionThrown({
        exceptionDetails: result.exceptionDetails,
        timestamp: Date.now(),
      })
    }
    const value = await this.#resolver.resolve(result.result)
    this.#repl.disable()
    console.log(value)
    this.#repl.enable()
  }

  private async onExecutionContextCreated(event: DevToolsInterface.Runtime.ExecutionContextCreatedEvent) {
    this.#contexts.set(event.context.id, event.context.origin)
    await this.#devtools.Runtime.evaluate({
      contextId: event.context.id,
      expression: `window.close = function(code = 0) { console.log('<<close>>', code) }`,
    })
    this.#barrier.resume()
  }

  private async onExecutionContextDestroyed(event: DevToolsInterface.Runtime.ExecutionContextDestroyedEvent) {
    this.#contexts.delete(event.executionContextId)
  }

  private async onConsoleApiCalled(event: DevToolsInterface.Runtime.ConsoleAPICalledEvent) {
    const args = await Promise.all(event.args.map((arg) => this.#resolver.resolve(arg)))
    if (args.length === 2 && args[0] === '<<close>>') {
      return this.#events.send('exit', args[1])
    }
    this.#repl.disable()
    switch (event.type) {
      case 'assert':
        console.assert(...args)
        break
      case 'clear':
        console.clear()
        break
      case 'count':
        console.count(...args)
        break
      case 'debug':
        console.debug(...args)
        break
      case 'dir':
        console.dir(...args)
        break
      case 'dirxml':
        console.dirxml(...args)
        break
      case 'endGroup':
        console.groupEnd()
        break
      case 'error':
        console.error(...args)
        break
      case 'info':
        console.info(...args)
        break
      case 'log':
        console.log(...args)
        break
      case 'profile':
        console.profile(...args)
        break
      case 'profileEnd':
        console.profileEnd(...args)
        break
      case 'table':
        console.table(...args)
        break
      case 'trace':
        console.trace(...args)
        break
      case 'warning':
        console.warn(...args)
        break
    }
    this.#repl.enable()
  }

  private onExceptionThrown(event: DevToolsInterface.Runtime.ExceptionThrownEvent) {
    const exception = new Exception(event.exceptionDetails)
    this.#events.send('close', exception)
    this.#repl.disable()
    console.error(Color.red, exception, Color.esc)
    this.#repl.enable()
  }
}
