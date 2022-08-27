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

import { Deferred } from './deferred.mjs'

// --------------------------------------------------------------------------
// ResponderHandle
// --------------------------------------------------------------------------

type ResponderHandle = number

// --------------------------------------------------------------------------
// Responder
// --------------------------------------------------------------------------

export class Responder {
  readonly #deferreds: Map<ResponderHandle, Deferred<any>>
  #ordinal: number
  constructor() {
    this.#deferreds = new Map<ResponderHandle, Deferred<any>>()
    this.#ordinal = 0
  }

  /** Registers a new responder with specified context */
  public register(): ResponderHandle {
    const deferred = new Deferred()
    const handle = this.#ordinal++
    this.#deferreds.set(handle, deferred)
    return handle
  }

  /** Returns true if this handle exists */
  public has(handle: number): boolean {
    return this.#deferreds.has(handle)
  }

  /** Waits for the given handle to resolve. If the handle does not exist and error is thrown. */
  public async wait<T = any>(handle: ResponderHandle): Promise<T> {
    if (!this.#deferreds.has(handle)) throw Error(`Responder: Cannot wait for handle ${handle} as it does not exist`)
    const deferred = this.#deferreds.get(handle)!
    try {
      const result = await deferred.promise()
      this.#deferreds.delete(handle)
      return result
    } catch (error) {
      this.#deferreds.delete(handle)
      throw error
    }
  }

  /** Resolves a deferred with the given result */
  public resolve<T = any>(handle: ResponderHandle, value: T) {
    if (!this.#deferreds.has(handle)) return
    const entry = this.#deferreds.get(handle)!
    entry.resolve(value)
    this.#deferreds.delete(handle)
  }

  /** Rejects a deferred with the given error */
  public reject(handle: ResponderHandle, error: Error) {
    if (!this.#deferreds.has(handle)) return
    const deferred = this.#deferreds.get(handle)!
    deferred.reject(error)
    this.#deferreds.delete(handle)
  }

  /** Rejects all deferreds matching the given context */
  public rejectAll(error: Error) {
    for (const [handle, deferred] of this.#deferreds) {
      this.#deferreds.delete(handle)
      deferred.reject(error)
    }
  }
}
