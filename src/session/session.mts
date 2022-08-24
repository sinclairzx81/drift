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
// Session
// ------------------------------------------------------------------------

export class Session {
  readonly #resolver: ValueResolver
  readonly #devtools: DevToolsInterface.DevTools
  readonly #repl: Repl
  readonly #events: Events
  readonly #console: Barrier
  readonly #ready: Barrier

  constructor(websocketDebuggerEndpoint: string, repl: Repl) {
    this.#repl = repl
    this.#devtools = new DevToolsInterface.DevTools(new DevToolsAdapter(websocketDebuggerEndpoint))
    this.#resolver = new ValueResolver(this.#devtools)
    this.#events = new Events()
    this.#console = new Barrier(true)
    this.#ready = new Barrier(true)
    this.setup().catch((error) => console.error(error))
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
    this.#devtools.Page.on('loadEventFired', (event) => this.onLoadEventFired(event))
    await this.#devtools.Network.enable({})
    await this.#devtools.Runtime.enable({})
    await this.#devtools.Page.enable({})
    this.#console.resume()
    this.#ready.resume()
  }

  // ---------------------------------------------------------------
  // Interface
  // ---------------------------------------------------------------

  /** Runs the given script in the page */
  public async run(code: string): Promise<void> {
    await this.#ready.wait()
    const expression = `(async function () { ${code} })();`
    const result = await this.#devtools.Runtime.evaluate({ expression })
    if (result.exceptionDetails) {
      return this.onExceptionThrown({
        exceptionDetails: result.exceptionDetails,
        timestamp: Date.now(),
      })
    }
  }

  public async evaluate(expression: string): Promise<void> {
    await this.#ready.wait()
    this.#console.pause()

    const result = await this.#devtools.Runtime.evaluate({ expression })
    if (result.exceptionDetails) {
      this.#console.resume()
      const error = new Error(result.exceptionDetails.exception?.description)
      return this.consoleError(error)
    }

    // if the result is undefined and the expression has a console call, we
    // need to need to suspend the console barrier and wait for the console
    // log event to resume.
    const value = await this.#resolver.resolve(result.result)
    if (value === undefined && expression.includes('console.')) {
      await this.#console.wait() // resumed on console event
    }

    this.#repl.disable()
    console.log(value)
    this.#repl.enable()
  }

  public async position(x: number, y: number) {
    await this.#ready.wait()
    const target = await this.#devtools.Browser.getWindowForTarget({})
    await this.#devtools.Browser.setWindowBounds({
      windowId: target.windowId,
      bounds: { left: x, top: y, windowState: 'normal' },
    })
  }

  public async size(width: number, height: number) {
    await this.#ready.wait()
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

  public async navigate(url: string): Promise<void> {
    await this.#ready.wait()
    await this.#devtools.Page.navigate({ url })
    this.#ready.pause()
  }

  public async image(format: 'png' | 'jpeg'): Promise<Uint8Array> {
    await this.#ready.wait()
    const result = await this.#devtools.Page.captureScreenshot({ format })
    return Buffer.from(result.data, 'base64')
  }

  public async pdf(): Promise<Uint8Array> {
    await this.#ready.wait()
    const result = await this.#devtools.Page.printToPDF({})
    return Buffer.from(result.data, 'base64')
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
  // Console Output
  // ---------------------------------------------------------------

  private consoleLog(...args: any[]) {
    this.#repl.disable()
    console.log(...args)
    this.#repl.enable()
  }

  private consoleError(...args: any[]) {
    this.#repl.disable()
    console.log(Color.red, ...args, Color.esc)
    this.#repl.enable()
  }

  private consoleClear() {
    this.#repl.disable()
    console.clear()
    this.#repl.enable()
  }
  // ---------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------

  private async onExecutionContextCreated(event: DevToolsInterface.Runtime.ExecutionContextCreatedEvent) {
    const history = await this.#devtools.Page.getNavigationHistory({})
    const current = history.entries[history.entries.length - 1]
    if (new URL(current.url).origin === event.context.origin) {
      this.consoleLog(Color.Gray('ready'), current.url)
    }
    await this.#devtools.Runtime.evaluate({
      contextId: event.context.id,
      expression: `window.close = function(code = 0) { console.log('<<close>>', code) }`,
    })
    this.#ready.resume()
  }

  private async onExecutionContextDestroyed(event: DevToolsInterface.Runtime.ExecutionContextDestroyedEvent) {
    // todo: not implemented
  }

  private async onLoadEventFired(event: DevToolsInterface.Page.LoadEventFiredEvent) {
    // note: not implemented
  }

  private async onConsoleApiCalled(event: DevToolsInterface.Runtime.ConsoleAPICalledEvent) {
    const args = await Promise.all(event.args.map((arg) => this.#resolver.resolve(arg)))
    if (args.length === 2 && args[0] === '<<close>>') {
      return this.#events.send('exit', args[1])
    } else {
      switch (event.type) {
        case 'clear': {
          this.consoleClear()
          break
        }
        case 'error': {
          this.consoleError(...args)
          break
        }
        default: {
          this.consoleLog(...args)
        }
      }
      this.#console.resume()
    }
  }

  private onExceptionThrown(event: DevToolsInterface.Runtime.ExceptionThrownEvent) {
    const exception = new Exception(event.exceptionDetails)
    this.#events.send('close', exception)
    this.consoleError(exception)
  }
}
