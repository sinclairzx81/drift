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
import * as Fs from 'node:fs'

export class Watch {
  #watchers: Fs.FSWatcher[]
  #debounce: Debounce
  #events: Events

  constructor() {
    this.#watchers = []
    this.#events = new Events()
    this.#debounce = new Debounce(500, false)
  }

  public on(event: 'change', handler: EventHandler<void>): EventListener
  public on(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.on(event, handler)
  }

  public add(path: string) {
    const watcher = Fs.watch(path)
    watcher.on('change', () => this.#onChange())
    this.#watchers.push(watcher)
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
}
