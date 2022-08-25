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

export namespace Color {
  export const esc = `\x1b[0m`
  export const gray = '\x1b[90m'
  export const red = '\x1b[91m'
  export const green = '\x1b[92m'
  export const yellow = '\x1b[93m'
  export const blue = '\x1b[94m'
  export const purple = '\x1b[95m'
  export const cyan = '\x1b[96m'
  export const white = '\x1b[97m'

  export function Gray(input: string) {
    return `${gray}${input}${esc}`
  }
  export function Red(input: string) {
    return `${esc}${red}${input}${esc}`
  }
  export function Green(input: string) {
    return `${esc}${green}${input}${esc}`
  }
  export function Yellow(input: string) {
    return `${esc}${yellow}${input}${esc}`
  }
  export function Blue(input: string) {
    return `${esc}${blue}${input}${esc}`
  }
  export function Purple(input: string) {
    return `${esc}${purple}${input}${esc}`
  }
  export function Cyan(input: string) {
    return `${esc}${cyan}${input}${esc}`
  }
  export function White(input: string) {
    return `${esc}${white}${input}${esc}`
  }
}
