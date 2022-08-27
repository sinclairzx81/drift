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

import { createInterface, Interface } from 'node:readline'
import { stdin, stdout } from 'node:process'
import { Channel } from '../channel/index.mjs'
import { Color } from '../color/index.mjs'
import { Read } from '../stream/read.mjs'

export class Repl implements Read<string> {
  readonly #interface: Interface
  readonly #channel: Channel<string>
  readonly #history: string[]

  constructor() {
    this.#channel = new Channel<string>()
    this.#history = []
    this.#interface = createInterface({ input: stdin, output: stdout, history: this.#history })
    this.#interface.on('line', (line) => this.#onLine(line))
    this.#interface.on('close', () => this.#onClose())
  }

  public async *[Symbol.asyncIterator](): AsyncIterableIterator<string> {
    while (true) {
      const next = await this.read()
      if (next === null) return
      yield next
    }
  }

  /** Disables the terminal prompt. Disabled during browser logging */
  public disable() {
    this.#interface.setPrompt('')
    this.#interface.prompt(true)
  }

  /** Enables the terminal prompt. Calling this function will reset the input prompt. */
  public enable() {
    this.#interface.setPrompt(Color.Gray('> '))
    this.#interface.prompt(true)
  }

  public async read(): Promise<string | null> {
    return await this.#channel.next()
  }

  public async close(): Promise<void> {
    this.#interface.close()
  }

  #onLine(line: string) {
    this.#channel.send(line)
  }

  #onClose() {
    this.#channel.end()
  }
}
