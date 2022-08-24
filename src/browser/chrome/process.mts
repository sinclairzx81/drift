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
import { ChromePath } from './path.mjs'

export interface ChromeOptions {
  port: number
  user: string
  headless: boolean
  verbose: boolean
}

export class Chrome {
  readonly #process: ChildProcess
  readonly #port: number

  constructor(options: ChromeOptions) {
    const flags = options.headless ? [`--headless`, `--user-data-dir=${options.user}`, `--remote-debugging-port=${options.port}`] : [`--user-data-dir=${options.user}`, `--remote-debugging-port=${options.port}`]
    this.#port = options.port
    this.#process = spawn(ChromePath.get(), flags)
    if (options.verbose) {
      this.#process.stderr?.setEncoding('utf-8')
      this.#process.stderr!.on('data', (data) => console.log(data))
    }
  }

  public async webSocketDebuggerUrl(): Promise<string> {
    return await Retry({ times: 100, delay: 50 }, async () => {
      const result = await Request.get(`http://127.0.0.1:${this.#port}/json`).then((text) => JSON.parse(text))
      if (!Array.isArray(result)) throw Error('Chrome: Unexpected response from metadata json endpoint')
      if (typeof result[0].webSocketDebuggerUrl !== 'string') throw Error('Chrome: The webSocketDebuggerUrl was invalid')
      return result[0].webSocketDebuggerUrl.replace(/localhost/, '127.0.0.1')
    })
  }

  public async close(): Promise<void> {
    this.#process.kill()
  }
}
