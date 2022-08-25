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

import * as fs from 'node:fs/promises'
import * as path from 'node:path'

export class Mutex {
  readonly #path: string
  #locked: boolean

  constructor(path: string) {
    this.#path = path
    this.#locked = false
  }

  public async lock() {
    await this.#acquire()
  }

  public async unlock() {
    await this.#release()
  }

  async #acquire() {
    await this.#ensureDirectory()
    while (true) {
      try {
        const file = await fs.open(this.#path, 'wx+')
        await file.write(process.pid.toString())
        await file.close()
        this.#locked = true
        return
      } catch (e) {
        await this.#tryfree()
        await this.#delay(10)
      }
    }
  }

  async #release() {
    if (this.#locked === false) return
    await fs.unlink(this.#path).catch(() => {})
    this.#locked = false
  }

  async #tryfree(): Promise<void> {
    if ((await this.#owned()) === false) return
    const content = await fs.readFile(this.#path, 'utf-8').catch(() => null)
    if (content === null) return
    const owner = parseInt(content)
    if (isNaN(owner)) return
    if (this.#running(owner)) return
    await fs.unlink(this.#path).catch(() => {})
  }

  #owned(): Promise<boolean> {
    return fs
      .stat(this.#path)
      .then(() => true)
      .catch(() => false)
  }

  #running(pid: number) {
    try {
      return process.kill(pid, 0)
    } catch (error: any) {
      if (typeof error.code === 'string') {
        return error.code === 'EPERM'
      } else {
        return false
      }
    }
  }

  #delay(timeout: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), timeout)
    })
  }

  async #ensureDirectory() {
    const resolved = path.resolve(this.#path)
    const dirname = path.dirname(resolved)
    await fs.mkdir(dirname, { recursive: true })
  }
}
