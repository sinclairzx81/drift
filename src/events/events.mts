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

// --------------------------------------------------------
// EventListener
// --------------------------------------------------------

export class EventListener {
  readonly #callback: () => any
  constructor(callback: () => any) {
    this.#callback = callback
  }
  /** Disposes of this event listener */
  public close() {
    this.#callback()
  }
}

// --------------------------------------------------------
// EventHandler<T>
// --------------------------------------------------------

export type EventHandler<T> = (value: T) => any

// --------------------------------------------------------
// EventHandler<T>
// --------------------------------------------------------

export class Event<T> {
  readonly #subscriptions: Set<readonly [boolean, EventHandler<T>]>
  constructor() {
    this.#subscriptions = new Set<readonly [boolean, EventHandler<T>]>()
  }

  /** Subscribes to events */
  public on(handler: EventHandler<T>): EventListener {
    const subscription = [false, handler] as const
    this.#subscriptions.add(subscription)
    return new EventListener(() => this.#subscriptions.delete(subscription))
  }

  /** Subscribes once to an event */
  public once(handler: EventHandler<T>): EventListener {
    const subscription = [true, handler] as const
    this.#subscriptions.add(subscription)
    return new EventListener(() => this.#subscriptions.delete(subscription))
  }

  /** Sends a value to subscribers */
  public send(value: T): any {
    for (const subscriber of this.#subscriptions) {
      const [once, handler] = subscriber
      if (once) this.#subscriptions.delete(subscriber)
      handler(value)
    }
  }

  /** Returns the subscriber count for this event */
  public count(): number {
    return this.#subscriptions.size
  }

  /** Disposes of this event */
  public dispose() {
    this.#subscriptions.clear()
  }
}

// --------------------------------------------------------
// Events
// --------------------------------------------------------

export class Events {
  readonly #events: Map<string, Event<any>>

  constructor() {
    this.#events = new Map<string, Event<any>>()
  }

  /** Subscribes to an event */
  public on<T = unknown>(event: string, handler: EventHandler<T>): EventListener {
    if (!this.#events.has(event)) this.#events.set(event, new Event())
    const current = this.#events.get(event)!
    return current.on(handler)
  }

  /** Subscribes once to an event */
  public once<T = unknown>(event: string, handler: EventHandler<T>): EventListener {
    if (!this.#events.has(event)) this.#events.set(event, new Event())
    const current = this.#events.get(event)!
    return current.once(handler)
  }

  /** Sends a value to subscribers of this event */
  public send<T = unknown>(event: string, value: T) {
    if (!this.#events.has(event)) return
    const current = this.#events.get(event)!
    current.send(value)
  }

  /** Returns the subscriber count for this event */
  public count(event: string): number {
    if (!this.#events.has(event)) return 0
    const current = this.#events.get(event)!
    return current.count()
  }

  /** Closes this event */
  public close() {
    for (const [key, event] of this.#events) {
      this.#events.delete(key)
      event.dispose()
    }
  }
}
