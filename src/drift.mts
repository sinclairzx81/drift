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

import { Platform, Color, Build, ChromeStart, Session, Repl, Commands, Delay, Command, UserCommand } from './index.mjs'
import { existsSync, readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

// --------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------

function version() {
  const path = join(Platform.resolveDirname(import.meta.url), 'package.json')
  if (!existsSync(path)) return Color.White('0.8.10')
  const packageJson = JSON.parse(readFileSync(path, 'utf-8'))
  return Color.White(packageJson.version)
}

/** Resolves the chrome user directory. Will default to node_modules directory if not specified. */
function userdir(commands: Command[]) {
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
  
       version: ${version()}`),
  )
}
function help() {
  console.log(`
Format:

  $ drift [...command]

Examples:

  # load page
  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')}
  
  # load script
  $ drift ${Color.Gray('run')} ${Color.Blue('script.ts')}

  # load page then load script into page
  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')} ${Color.Gray('run')} ${Color.Blue('script.ts')}

  # load page, wait one second then take screenshot
  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')} ${Color.Gray('wait')} ${Color.Blue('1000')} ${Color.Gray('save')} ${Color.Blue('screenshot.png')}

Commands:

  ${Color.Gray('url')}     ${Color.Blue('<url>')}    Navigate to the given url.
  ${Color.Gray('run')}     ${Color.Blue('<path>')}   Runs a script in the current url.  
  ${Color.Gray('size')}    ${Color.Blue('<w> <h>')}  Sets desktop window size.
  ${Color.Gray('pos')}     ${Color.Blue('<x> <y>')}  Sets desktop window position.
  ${Color.Gray('save')}    ${Color.Blue('<path>')}   Save current page as png, jpeg or pdf format.
  ${Color.Gray('user')}    ${Color.Blue('<path>')}   Sets the chrome user data directory.
  ${Color.Gray('click')}   ${Color.Blue('<x> <y>')}  Send mousedown event to the current url.
  ${Color.Gray('wait')}    ${Color.Blue('<ms>')}     Wait for the given milliseconds.
  ${Color.Gray('window')}  ${Color.Blue('')}         Run with desktop window.
  ${Color.Gray('help')}    ${Color.Blue('')}         Lists available commands.
  ${Color.Gray('close')}   ${Color.Blue('')}         Closes the drift process.
  `)
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
  banner()
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
const user = userdir(commands)
const repl = new Repl()
const browser = await ChromeStart.start({ user, headless, verbose: false })
const session = new Session(await browser.webSocketDebuggerUrl, repl)
session.on('exit', (code) => browser.close().then(() => process.exit(code)))
browser.on('exit', () => process.exit(0))

// --------------------------------------------------------------------
// Commands
// --------------------------------------------------------------------

for (const command of commands) {
  switch (command.type) {
    case 'click': {
      print('viewport', command.x, command.y)
      await session.click(command.x, command.y)
      break
    }
    case 'close': {
      print('close')
      await browser.close()
      process.exit(0)
    }
    case 'run': {
      print('run', command.path)
      const code = Build.build(command.path)
      await session.run(code)
      break
    }
    case 'pos': {
      print('pos', command.x, command.y)
      await session.position(command.x, command.y)
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
    case 'url': {
      print('url', command.url)
      await session.navigate(command.url)
      break
    }
    case 'wait': {
      print('wait', command.ms)
      await Delay.wait(command.ms)
      break
    }
  }
}

// --------------------------------------------------------------------
// Drift !!
// --------------------------------------------------------------------

print('drift', 'Use ctrl+c or close() to exit')

repl.enable()

for await (const input of repl) {
  await session.evaluate(input)
}

browser.close()
