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

import { extname, resolve } from 'node:path'
import { existsSync } from 'node:fs'

// -------------------------------------------------------------------------
// Commands
// -------------------------------------------------------------------------

export type Command = ClickCommand | CloseCommand | HelpCommand | NavCommand | PosCommand | RunCommand | SaveCommand | SizeCommand | UserCommand | WaitCommand | WindowCommand

export interface ClickCommand {
  type: 'click'
  x: number
  y: number
}

export interface CloseCommand {
  type: 'close'
}

export interface HelpCommand {
  type: 'help'
}

export interface NavCommand {
  type: 'nav'
  url: string
}

export interface PosCommand {
  type: 'pos'
  x: number
  y: number
}

export interface SaveCommand {
  type: 'save'
  format: 'png' | 'jpeg' | 'pdf'
  path: string
}

export interface SizeCommand {
  type: 'size'
  width: number
  height: number
}

export interface RunCommand {
  type: 'run'
  path: string
}

export interface UserCommand {
  type: 'user'
  path: string
}

export interface WaitCommand {
  type: 'wait'
  ms: number
}

export interface WindowCommand {
  type: 'window'
}

// -------------------------------------------------------------------------
// Command Parser
// -------------------------------------------------------------------------

export namespace Commands {
  function isUrlString(input: string) {
    try {
      const url = new URL(input)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {}
    return false
  }

  function isNumericString(input: string) {
    return !isNaN(input as any) && !isNaN(parseFloat(input))
  }

  function isIntegerString(input: string) {
    return isNumericString(input) && !input.includes('.')
  }

  function parseSaveFormat(path: string): `jpeg` | 'png' | 'pdf' {
    const ext = extname(path)
    if (['.jpg', '.jpeg'].includes(ext)) return 'jpeg'
    if (['.png'].includes(ext)) return 'png'
    if (['.pdf'].includes(ext)) return 'pdf'
    throw new Error(`Unsupported save format for path '${path}'. Expect .png, .jpeg, .jpg or .pdf`)
  }

  function parseInputPath(path: string): string {
    if (!existsSync(path)) throw new Error(`Input file path '${path}' not found`)
    return resolve(path)
  }

  function parseOutputPath(path: string): string {
    if (path === undefined) throw Error('Expected output path')
    return resolve(path)
  }

  function parseInteger(params: string[]): number {
    const input = params.shift()!
    if (!isIntegerString(input)) throw Error('Expected integer argument')
    return parseInt(input)
  }

  function parseUrl(params: string[]): string {
    const input = params.shift()!
    if (!isUrlString(input)) throw Error('Expected Url')
    return input
  }

  function parseHelp(params: string[]): HelpCommand {
    return { type: 'help' }
  }

  function parseUser(params: string[]): UserCommand {
    const path = parseOutputPath(params.shift()!)
    return { type: 'user', path }
  }

  function parseNav(params: string[]): NavCommand {
    return { type: 'nav', url: parseUrl(params) }
  }

  function parsePos(params: string[]): PosCommand {
    const x = parseInteger(params)
    const y = parseInteger(params)
    return { type: 'pos', x, y }
  }

  function parseRun(params: string[]): RunCommand {
    return { type: 'run', path: parseInputPath(params.shift()!) }
  }

  function parseWindow(params: string[]): WindowCommand {
    return { type: 'window' }
  }

  function parseSave(params: string[]): SaveCommand {
    const path = params.shift()!
    return { type: 'save', format: parseSaveFormat(path), path: parseOutputPath(path) }
  }

  function parseWait(params: string[]): WaitCommand {
    return { type: 'wait', ms: parseInteger(params) }
  }

  function parseSize(params: string[]): SizeCommand {
    const width = parseInteger(params)
    const height = parseInteger(params)
    return { type: 'size', width, height }
  }

  function parseClick(params: string[]): ClickCommand {
    const x = parseInteger(params)
    const y = parseInteger(params)
    return { type: 'click', x, y }
  }

  function parseClose(params: string[]): CloseCommand {
    return { type: 'close' }
  }

  function* parseAny(params: string[]): IterableIterator<Command> {
    while (params.length > 0) {
      const command = params.shift()!
      try {
        switch (command) {
          case 'help': {
            yield parseHelp(params)
            break
          }
          case 'user': {
            yield parseUser(params)
            break
          }
          case 'nav': {
            yield parseNav(params)
            break
          }
          case 'pos': {
            yield parsePos(params)
            break
          }
          case 'run': {
            yield parseRun(params)
            break
          }
          case 'save': {
            yield parseSave(params)
            break
          }
          case 'wait': {
            yield parseWait(params)
            break
          }
          case 'window': {
            yield parseWindow(params)
            break
          }
          case 'size': {
            yield parseSize(params)
            break
          }
          case 'click': {
            yield parseClick(params)
            break
          }
          case 'close': {
            yield parseClose(params)
            break
          }
          default:
            throw new Error(`Unknown command '${command}'`)
        }
      } catch (error: any) {
        throw Error(`error: command '${command}' ${error.message}`)
      }
    }
  }

  export function parse(): Command[] {
    try {
      const params = process.argv.slice(2)
      return [...parseAny(params)]
    } catch (error: any) {
      console.log(error.message)
      process.exit(1)
    }
  }
}
