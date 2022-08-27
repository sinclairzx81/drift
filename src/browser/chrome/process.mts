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

import { spawn, ChildProcess } from 'node:child_process'
import { join } from 'node:path'
import { Events, EventHandler, EventListener } from '../../events/index.mjs'
import { Delay, Retry } from '../../async/index.mjs'
import { Mutex } from '../../mutex/index.mjs'
import { Request } from '../../request/index.mjs'
import { ChromePath } from './path.mjs'

export interface ChromeOptions {
  headless: boolean
  incognito: boolean
  devtools: boolean
  verbose: boolean
  user: string
}

export namespace ChromeStart {
  const defaultPort = 4800

  async function getWebSocketDebuggerUrl(port: number) {
    return await Retry({ times: 40, delay: 100 }, async () => {
      const result = await Request.get(`http://localhost:${port}/json`).then((text) => JSON.parse(text))
      if (!Array.isArray(result)) throw Error('Chrome: Unexpected response from metadata json endpoint')
      if (typeof result[0].webSocketDebuggerUrl !== 'string') throw Error('Chrome: The webSocketDebuggerUrl was invalid')
      return result[0].webSocketDebuggerUrl.replace(/localhost/, '127.0.0.1')
    })
  }

  async function findUnusedPort() {
    for (let port = defaultPort; port < defaultPort + 64; port++) {
      try {
        await getWebSocketDebuggerUrl(port)
      } catch {
        return port
      }
    }
    throw Error('ChromeStart: Cannot find free port to attach debugger')
  }

  export async function start(options: ChromeOptions): Promise<Chrome> {
    const mutex = new Mutex(join(options.user, '/mutex'))
    await mutex.lock()
    const port = await findUnusedPort()
    const user = join(options.user, `/port_${port}`)
    const flags = ['about:blank']
    if (options.devtools) flags.push('--auto-open-devtools-for-tabs')
    if (options.incognito) flags.push('--incognito')
    if (options.headless) flags.push('--headless')
    flags.push('--hide-crash-restore-bubble')
    flags.push(`--user-data-dir=${user}`)
    flags.push(`--remote-debugging-port=${port}`)
    flags.push('--no-default-browser-check')

    const process = spawn(ChromePath.get(), flags)
    const webSocketDebuggerUrl = await getWebSocketDebuggerUrl(port)
    const chrome = new Chrome(process, webSocketDebuggerUrl, options.verbose)
    await mutex.unlock()
    return chrome
  }
}

export class Chrome {
  readonly #process: ChildProcess
  readonly #websocketDebuggerUrl: string
  readonly #events: Events

  constructor(process: ChildProcess, websocketDebuggerUrl: string, verbose: boolean) {
    this.#events = new Events()
    this.#websocketDebuggerUrl = websocketDebuggerUrl
    this.#process = process
    this.#process.on('exit', () => this.#onExit())
    if (verbose) {
      this.#process.stderr?.setEncoding('utf-8')
      this.#process.stderr!.on('data', (data) => this.#events.send('log', data))
    }
  }
  public once(event: 'log', handler: EventHandler<string>): EventListener
  public once(event: 'exit', handler: EventHandler<void>): EventListener
  public once(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.once(event, handler)
  }
  public on(event: 'log', handler: EventHandler<string>): EventListener
  public on(event: 'exit', handler: EventHandler<void>): EventListener
  public on(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.on(event, handler)
  }

  public get webSocketDebuggerUrl(): string {
    return this.#websocketDebuggerUrl
  }

  public async close(): Promise<void> {
    this.#process.kill('SIGTERM')
  }

  #onExit() {
    this.#events.send('exit', void 0)
  }
}
