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
import { Retry } from '../../async/index.mjs'
import { Request } from '../../request/index.mjs'
import { FirefoxPath } from './path.mjs'

export interface FireFoxOptions {
  port: number
  temp: string
  log: boolean
}

export class Firefox {
  readonly #process: ChildProcess
  readonly #port: number
  readonly #temp: string

  constructor(options: FireFoxOptions) {
    this.#temp = options.temp
    this.#port = options.port
    const flags = ['--headless', `--remote-debugging-port=${options.port}`]
    this.#process = spawn(FirefoxPath.get(), flags)
    if (options.log) {
      this.#process.stderr?.setEncoding('utf-8')
      this.#process.stderr!.on('data', (data) => console.log(data))
    }
  }

  public async webSocketDebuggerUrl(): Promise<string> {
    return await Retry({ times: 100, delay: 50 }, async () => {
      const result: any = await Request.get(`http://127.0.0.1:${this.#port}/json/version`).then((text) => JSON.parse(text))
      if (typeof result.webSocketDebuggerUrl !== 'string') throw Error('webSocketDebuggerUrl was unknown')
      return result.webSocketDebuggerUrl.replace(/localhost/, '127.0.0.1')
    })
  }

  public async close(): Promise<void> {
    this.#process.kill()
  }
}
