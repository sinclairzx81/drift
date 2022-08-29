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

// ------------------------------------------------------------------------
// Exports
// ------------------------------------------------------------------------

export * from './async/index.mjs'
export * from './browser/index.mjs'
export * from './build/index.mjs'
export * from './command/index.mjs'
export * from './channel/index.mjs'
export * from './color/index.mjs'
export * from './platform/index.mjs'
export * from './repl/index.mjs'
export * from './events/index.mjs'
export * from './mutex/index.mjs'
export * from './request/index.mjs'
export * from './session/index.mjs'
export * from './platform/index.mjs'
export * from './repl/index.mjs'
export * from './stream/index.mjs'
export * from './watch/index.mjs'
export * from './ws/index.mjs'

// ------------------------------------------------------------------------
// Runtime
// ------------------------------------------------------------------------

declare global {
  interface Window {
    /** Drift Runtime. Only available if page is started via Drift command line */
    Drift: {
      /** Command line arguments */
      args: string[]
      /** Add style to current page */
      css(path: string): void
      /** Send mousedown event current page */
      click(x: number, y: number): void
      /** Close drift */
      close(exitcode?: number): void
      /** Set desktop window position */
      position(x: number, y: number): void
      /** Reload the current page */
      reload(): void
      /** Run script on current page */
      run(path: string): void
      /** Set desktop window size */
      size(w: number, h: number): void
      /** Save current page as png, jpeg or pdf format */
      save(path: string): void
      /** Navigate page to url endpoint */
      url(url: string): void
      /** Wait for milliseconds to elapse */
      wait(ms: number): Promise<void>
    }
  }
}
