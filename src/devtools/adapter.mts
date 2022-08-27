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

import { WebSocket, CloseEvent, ErrorEvent, MessageEvent } from '../ws/index.mjs'
import { Barrier, Responder } from '../async/index.mjs'
import { Events, EventHandler, EventListener } from '../events/index.mjs'

export class DevToolsAdapter {
  readonly #responder: Responder
  readonly #barrier: Barrier
  readonly #events: Events
  #socket: WebSocket

  constructor(endpoint: string) {
    this.#socket = new WebSocket(endpoint)
    this.#socket.on('open', () => this.#onOpen())
    this.#socket.on('message', (event) => this.#onMessage(event))
    this.#socket.on('error', (event) => this.#onError(event))
    this.#socket.on('close', (event) => this.#onClose(event))
    this.#responder = new Responder()
    this.#barrier = new Barrier(true)
    this.#events = new Events()
  }

  public on(event: string, handler: EventHandler<any>): EventListener {
    return this.#events.on(event, handler)
  }

  public async call(method: string, params: any): Promise<any> {
    await this.#barrier.wait()
    const handle = this.#responder.register()
    this.#socket.send(JSON.stringify({ method, params, id: handle }))
    return this.#responder.wait(handle)
  }

  #onOpen() {
    this.#barrier.resume()
    this.#events.send('open', void 0)
  }

  #onMessage(event: MessageEvent) {
    const message = JSON.parse(event.data as string)
    if (!message.id && typeof message.method === 'string' && message.params) {
      return this.#events.send(message.method, message.params)
    }
    if (this.#responder.has(message.id)) {
      this.#responder.resolve(message.id, message.result)
    }
  }

  #onError(error: ErrorEvent) {
    this.#events.send('error', error)
    this.#barrier.resume()
  }

  #onClose(event: CloseEvent) {
    this.#events.send('close', void 0)
  }

  async #dispose() {
    await this.#barrier.wait()
  }
}
