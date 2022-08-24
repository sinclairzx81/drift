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

import { Platform, Color, Build, Chrome, Session, Repl, Commands, Delay, Command, UserCommand } from './index.mjs'
import { existsSync, readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

// --------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------

function version() {
  const path = join(Platform.resolveDirname(import.meta.url), 'package.json')
  if (!existsSync(path)) return Color.White('0.8.1')
  const packageJson = JSON.parse(readFileSync(path, 'utf-8'))
  return Color.White(packageJson.version)
}

/** Resolves the chrome user directory. Will default to node_modules directory if not specified. */
function userDir(commands: Command[]) {
  const command = commands.find((command) => command.type === 'user') as UserCommand | undefined
  if (command === undefined) return join(Platform.resolveDirname(import.meta.url), 'user')
  return resolve(command.path)
}

/** Prints standard command message */
function print(command: string, ...params: any[]) {
  console.log(Color.Gray(command), ...params)
}
function banner() {
  console.log(
    Color.Gray(`
        _      _  __ _   
       | |    (_)/ _| |  
     __| |_ __ _| |_| |_ 
    / _\` | '__| |  _| __|
   | (_| | |  | | | | |_ 
    \\__,_|_|  |_|_|  \\__|
  
       version: ${version()}
  `),
  )
}
function help() {
  console.log(
    Color.Gray(
      `
    ┌────────────────────────┬─────────────────────────────────────────────────────────────────┐
    │ command                │ description                                                     │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ url <url>              │ Loads this Url                                                  │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ run <path>             │ Loads a script into the current page                            │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ window                 │ Run with a chrome window                                        │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ size <w> <h>           │ Sets the chrome window size                                     │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ pos <x> <y>            │ Sets the chrome window position                                 │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ click <x> <y>          │ Send mousedown click event to the current page                  │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ save <path>            │ Save current page as png, jpeg or pdf format                    │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ user <path>            │ Sets the chrome user data directory                             │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ wait <ms>              │ Wait for the given milliseconds                                 │
    ├────────────────────────┼─────────────────────────────────────────────────────────────────┤
    │ close                  │ Closes the drift process                                        │
    └────────────────────────┴─────────────────────────────────────────────────────────────────┘
    `
        .split('\n')
        .map((n) => n.trim())
        .join('\n'),
    ),
  )
  process.exit(0)
}

// --------------------------------------------------------------------
// Commands
// --------------------------------------------------------------------

const commands = Commands.parse()

// --------------------------------------------------------------------
// Help
// --------------------------------------------------------------------

if (commands.find((command) => command.type === 'help')) {
  help()
}

// --------------------------------------------------------------------
// Banner
// --------------------------------------------------------------------

if (commands.length === 0) {
  banner()
}

// --------------------------------------------------------------------
// Browser and Execution Context
// --------------------------------------------------------------------

const headless = commands.find((command) => command.type === 'window') === undefined
const port = 14022
const user = userDir(commands)
const repl = new Repl()
const browser = new Chrome({ port, user, verbose: false, headless })
const session = new Session(await browser.webSocketDebuggerUrl(), repl)
session.on('exit', (code) => browser.close().then(() => process.exit(code)))
browser.on('exit', () => process.exit(0))

// --------------------------------------------------------------------
// Commands
// --------------------------------------------------------------------

for (const command of commands) {
  switch (command.type) {
    case 'url': {
      print('url', command.url)
      await session.navigate(command.url)
      break
    }
    case 'run': {
      print('run', command.path)
      const code = Build.build(command.path)
      await session.run(code)
      break
    }
    case 'save': {
      print('save', command.path)
      if (command.format !== 'pdf') {
        await writeFile(command.path, await session.image(command.format))
      } else {
        await writeFile(command.path, await session.pdf())
      }
      break
    }
    case 'size': {
      print('size', command.width, command.height)
      await session.size(command.width, command.height)
      break
    }
    case 'pos': {
      print('pos', command.x, command.y)
      await session.position(command.x, command.y)
      break
    }
    case 'click': {
      print('viewport', command.x, command.y)
      await session.click(command.x, command.y)
      break
    }
    case 'wait': {
      print('wait', command.ms)
      await Delay.wait(command.ms)
      break
    }
    case 'close': {
      print('close')
      await browser.close()
      process.exit(0)
    }
  }
}

// --------------------------------------------------------------------
// Repl
// --------------------------------------------------------------------

print('ready', 'Use ctrl+c or close() to exit')

repl.enable()

for await (const input of repl) {
  await session.evaluate(input)
}

browser.close()
