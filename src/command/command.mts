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

import { Color } from '../color/index.mjs'
import * as Path from 'node:path'
import * as Fs from 'node:fs'

// -------------------------------------------------------------------------
// Commands
// -------------------------------------------------------------------------

export type Command =
  | ArgsCommand
  | CloseCommand
  | CssCommand
  | DevToolsCommand
  | FailCommand
  | HelpCommand
  | IncognitoCommand
  | UrlCommand
  | MouseDownCommand
  | PositionCommand
  | ReloadCommand
  | ResetCommand
  | RunCommand
  | SaveCommand
  | SizeCommand
  | UserCommand
  | VerboseCommand
  | WaitCommand
  | WatchCommand
  | WindowCommand

export interface ArgsCommand {
  type: 'args'
  args: string[]
}

export interface CloseCommand {
  type: 'close'
}

export interface CssCommand {
  type: 'css'
  path: string
}

export interface DevToolsCommand {
  type: 'devtools'
}

export interface HelpCommand {
  type: 'help'
}

export interface FailCommand {
  type: 'fail'
}

export interface IncognitoCommand {
  type: 'incognito'
}

export interface UrlCommand {
  type: 'url'
  url: string
}

export interface MouseDownCommand {
  type: 'mousedown'
  x: number
  y: number
}

export interface PositionCommand {
  type: 'position'
  x: number
  y: number
}

export interface ReloadCommand {
  type: 'reload'
}

export interface ResetCommand {
  type: 'reset'
}

export interface RunCommand {
  type: 'run'
  path: string
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

export interface UserCommand {
  type: 'user'
  path: string
}

export interface VerboseCommand {
  type: 'verbose'
}

export interface WaitCommand {
  type: 'wait'
  ms: number
}

export interface WatchCommand {
  type: 'watch'
  paths: string[]
}

export interface WindowCommand {
  type: 'window'
}

// -------------------------------------------------------------------------
// Command Parser
// -------------------------------------------------------------------------

export namespace Commands {
  // -------------------------------------------------------------------------
  // Params Parser
  // -------------------------------------------------------------------------

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

  function parseArgumentList(params: string[]) {
    const args: string[] = []
    while (params.length > 0) {
      const next = params.shift()!
      if (isCommand(next)) {
        params.unshift(next)
        break
      }
      args.push(next)
    }
    return args
  }

  function parseWatchList(params: string[]) {
    const paths: string[] = []
    while (params.length > 0) {
      const next = params.shift()!
      if (isCommand(next)) {
        params.unshift(next)
        break
      }
      if (!Fs.existsSync(next)) throw Error(`Watch path '${next}' does not exist`)
      paths.push(next)
    }
    return paths
  }

  function parseSaveFormat(path: string): `jpeg` | 'png' | 'pdf' {
    const ext = Path.extname(path)
    if (['.jpg', '.jpeg'].includes(ext)) return 'jpeg'
    if (['.png'].includes(ext)) return 'png'
    if (['.pdf'].includes(ext)) return 'pdf'
    throw new Error(`Unsupported save format for path '${path}'. Expect .png, .jpeg, .jpg or .pdf`)
  }

  function parseInputPath(path: string): string {
    if (!Fs.existsSync(path)) throw new Error(`Input file path '${path}' not found`)
    return Path.resolve(path)
  }

  function parseOutputPath(path: string): string {
    if (path === undefined) throw Error('Expected output path')
    return Path.resolve(path)
  }

  function parseInteger(params: string[]): number {
    const input = params.shift()!
    if (!isIntegerString(input)) throw Error('Expected integer argument')
    return parseInt(input)
  }

  function parseUrlString(url: string): string {
    if (!isUrlString(url)) throw Error('Expected Url')
    return url
  }

  function parseUrl(params: string[]): UrlCommand {
    return { type: 'url', url: parseUrlString(params.shift()!) }
  }

  function isCommand(command: string) {
    return [
      'args',
      'click',
      'close',
      'css',
      'devtools',
      'help',
      'fail',
      'incognito',
      'position',
      'reload',
      'reset',
      'run',
      'save',
      'size',
      'url',
      'user',
      'verbose',
      'wait',
      'watch',
      'window',
    ].includes(command)
  }

  // -------------------------------------------------------------------------
  // Command Parser
  // -------------------------------------------------------------------------

  function parseArgs(params: string[]): ArgsCommand {
    return { type: 'args', args: parseArgumentList(params) }
  }

  function parseMousedown(params: string[]): MouseDownCommand {
    const x = parseInteger(params)
    const y = parseInteger(params)
    return { type: 'mousedown', x, y }
  }

  function parseClose(params: string[]): CloseCommand {
    return { type: 'close' }
  }

  function parseCss(params: string[]): CssCommand {
    return { type: 'css', path: parseInputPath(params.shift()!) }
  }

  function parseDevTools(params: string[]): DevToolsCommand {
    return { type: 'devtools' }
  }

  function parseHelp(params: string[]): HelpCommand {
    return { type: 'help' }
  }

  function parseFail(params: string[]): FailCommand {
    return { type: 'fail' }
  }

  function parseIncognito(params: string[]): IncognitoCommand {
    return { type: 'incognito' }
  }

  function parsePosition(params: string[]): PositionCommand {
    const x = parseInteger(params)
    const y = parseInteger(params)
    return { type: 'position', x, y }
  }

  function parseReload(params: string[]): ReloadCommand {
    return { type: 'reload' }
  }

  function parseReset(params: string[]): ResetCommand {
    return { type: 'reset' }
  }

  function parseRun(params: string[]): RunCommand {
    return { type: 'run', path: parseInputPath(params.shift()!) }
  }

  function parseSave(params: string[]): SaveCommand {
    const path = params.shift()!
    return { type: 'save', format: parseSaveFormat(path), path: parseOutputPath(path) }
  }

  function parseSize(params: string[]): SizeCommand {
    const width = parseInteger(params)
    const height = parseInteger(params)
    return { type: 'size', width, height }
  }

  function parseUser(params: string[]): UserCommand {
    const path = parseOutputPath(params.shift()!)
    return { type: 'user', path }
  }

  function parseVerbose(params: string[]): VerboseCommand {
    return { type: 'verbose' }
  }

  function parseWait(params: string[]): WaitCommand {
    return { type: 'wait', ms: parseInteger(params) }
  }

  function parseWatch(params: string[]): WatchCommand {
    const paths = parseWatchList(params)
    return { type: 'watch', paths }
  }

  function parseWindow(params: string[]): WindowCommand {
    return { type: 'window' }
  }

  function* parseAny(params: string[]): IterableIterator<Command> {
    while (params.length > 0) {
      const command = params.shift()!
      try {
        switch (command) {
          case 'args': {
            yield parseArgs(params)
            break
          }
          case 'close': {
            yield parseClose(params)
            break
          }
          case 'css': {
            yield parseCss(params)
            break
          }
          case 'devtools': {
            yield parseDevTools(params)
            break
          }
          case 'help': {
            yield parseHelp(params)
            break
          }
          case 'fail': {
            yield parseFail(params)
            break
          }
          case 'incognito': {
            yield parseIncognito(params)
            break
          }
          case 'mousedown': {
            yield parseMousedown(params)
            break
          }
          case 'position': {
            yield parsePosition(params)
            break
          }
          case 'reload': {
            yield parseReload(params)
            break
          }
          case 'reset': {
            yield parseReset(params)
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
          case 'size': {
            yield parseSize(params)
            break
          }
          case 'url': {
            yield parseUrl(params)
            break
          }
          case 'user': {
            yield parseUser(params)
            break
          }
          case 'verbose': {
            yield parseVerbose(params)
            return
          }
          case 'wait': {
            yield parseWait(params)
            break
          }
          case 'watch': {
            yield parseWatch(params)
            break
          }
          case 'window': {
            yield parseWindow(params)
            break
          }
          default:
            throw new Error(`Unknown command '${command}'`)
        }
      } catch (error: any) {
        throw Error(`${Color.Gray('drift')}: ${Color.Red('error')}: ${error.message}`)
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
