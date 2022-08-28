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

import { Events, EventHandler, EventListener } from '../events/index.mjs'
import { Debounce } from '../async/index.mjs'
import * as Path from 'node:path'
import * as Fs from 'node:fs'

export class Watch {
  #watchers: Fs.FSWatcher[]
  #debounce: Debounce
  #events: Events

  constructor() {
    this.#watchers = []
    this.#events = new Events()
    this.#debounce = new Debounce(200, false)
  }

  public on(event: 'change', handler: EventHandler<void>): EventListener
  public on(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.on(event, handler)
  }

  public add(path: string) {
    if (!Fs.existsSync(path) || Fs.statSync(path).isDirectory()) return
    const targetDirectory = Path.dirname(path)
    switch (process.platform) {
      case 'win32':
        return this.#watchWindows(targetDirectory)
      case 'darwin':
        return this.#watchDarwin(targetDirectory)
      case 'linux':
        return this.#watchLinux(targetDirectory)
      default:
        console.log(`warning: watch not supported on '${process.platform}' platform`)
    }
  }

  public close() {
    while (this.#watchers.length > 0) {
      const watcher = this.#watchers.shift()!
      watcher.close()
    }
  }

  #onChange() {
    this.#debounce.run(() => this.#events.send('change', void 0))
  }

  #watchDarwin(targetDirectory: string) {
    const watcher = Fs.watch(targetDirectory, { recursive: true })
    watcher.on('change', () => this.#onChange())
    this.#watchers.push(watcher)
  }

  #watchWindows(targetDirectory: string) {
    const watcher = Fs.watch(targetDirectory, { recursive: true })
    watcher.on('change', () => this.#onChange())
    this.#watchers.push(watcher)
  }

  #watchLinux(targetDirectory: string) {
    for (const directory of this.#enumerateDirectories(targetDirectory)) {
      const watcher = Fs.watch(directory)
      watcher.on('change', () => this.#onChange())
      this.#watchers.push(watcher)
    }
  }

  *#enumerateDirectories(directory: string): IterableIterator<string> {
    for (const entry of Fs.readdirSync(directory)) {
      const path = Path.join(directory, entry)
      const stat = Fs.statSync(path)
      if (stat.isDirectory()) yield* this.#enumerateDirectories(path)
    }
    yield directory
  }
}
