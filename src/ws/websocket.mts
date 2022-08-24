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

import { Platform } from '../platform/index.mjs'
const ws = await Platform.ambientImport<typeof import('ws')>('ws')
import type { WebSocket as WSWebSocket, MessageEvent, CloseEvent, ErrorEvent } from 'ws'
import { Events, EventHandler, EventListener } from '../events/index.mjs'
export type { MessageEvent, CloseEvent, ErrorEvent } from 'ws'

export class WebSocket {
  readonly #socket: WSWebSocket
  readonly #events: Events
  constructor(private readonly endpoint: string) {
    this.#events = new Events()
    this.#socket = new ws.WebSocket(this.endpoint)
    this.#socket.addEventListener('open', () => this.onOpen())
    this.#socket.addEventListener('message', (event) => this.onMessage(event))
    this.#socket.addEventListener('error', (event) => this.onError(event))
    this.#socket.addEventListener('close', (event) => this.onClose(event))
  }

  public on(event: 'open', func: EventHandler<void>): EventListener
  public on(event: 'message', func: EventHandler<MessageEvent>): EventListener
  public on(event: 'error', func: EventHandler<ErrorEvent>): EventListener
  public on(event: 'close', func: EventHandler<CloseEvent>): EventListener
  public on(event: string, func: EventHandler<any>) {
    return this.#events.on(event, func)
  }

  public once(event: 'open', func: EventHandler<void>): EventListener
  public once(event: 'message', func: EventHandler<MessageEvent>): EventListener
  public once(event: 'error', func: EventHandler<ErrorEvent>): EventListener
  public once(event: 'close', func: EventHandler<CloseEvent>): EventListener
  public once(event: string, func: EventHandler<any>) {
    return this.#events.once(event, func)
  }

  public send(data: any) {
    this.#socket.send(data)
  }

  public close(code?: number) {
    this.#socket.close(code)
  }

  private onOpen() {
    this.#events.send('open', void 0)
  }

  private onMessage(event: MessageEvent) {
    this.#events.send('message', event)
  }

  private onError(event: ErrorEvent) {
    this.#events.send('error', event)
  }

  private onClose(event: CloseEvent) {
    this.#events.send('close', event)
  }
}
