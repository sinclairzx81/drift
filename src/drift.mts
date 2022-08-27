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

// ------------------------------------------------------------------------
// Util Functions
// ------------------------------------------------------------------------

/** Checks if this command exists */
function has_command(type: Command['type'], commands: Command[]) {
  return commands.find((command) => command.type === type) !== undefined
}

/** Resolves the chrome user directory. Will default to node_modules directory if not specified. */
function user_dir(commands: Command[]) {
  const command = commands.find((command) => command.type === 'user') as UserCommand | undefined
  if (command === undefined) return join(Platform.resolveDirname(import.meta.url), 'user')
  return resolve(command.path)
}

/** Resolves the current package version */
function version() {
  const path = join(Platform.resolveDirname(import.meta.url), 'package.json')
  if (!existsSync(path)) return Color.White('0.8.10')
  const packageJson = JSON.parse(readFileSync(path, 'utf-8'))
  return Color.White(packageJson.version)
}

/** Prints standard command message */
function log(command: string, ...params: any[]) {
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
  console.log(`
Format:

  $ drift [...command | flag]

Examples:

  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')}
  $ drift ${Color.Gray('run')} ${Color.Blue('script.ts')}
  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')} ${Color.Gray('run')} ${Color.Blue('script.ts')}
  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')} ${Color.Gray('wait')} ${Color.Blue('1000')} ${Color.Gray('save')} ${Color.Blue('screenshot.png')}
  $ drift ${Color.Gray('window')} ${Color.Gray('devtools')} ${Color.Gray('url')} ${Color.Blue('https://domain.com')}

Commands:

  ${Color.Gray('url')}       ${Color.Blue('endpoint')}  Navigate page to given endpoint url
  ${Color.Gray('run')}       ${Color.Blue('path')}      Runs a script on the current page
  ${Color.Gray('css')}       ${Color.Blue('path')}      Adds a stylesheet to the current page
  ${Color.Gray('save')}      ${Color.Blue('path')}      Save current page as png, jpeg or pdf format
  ${Color.Gray('user')}      ${Color.Blue('path')}      Sets the chrome user data directory
  ${Color.Gray('size')}      ${Color.Blue('w h')}       Sets desktop window size
  ${Color.Gray('position')}  ${Color.Blue('x y')}       Sets desktop window position
  ${Color.Gray('click')}     ${Color.Blue('x y')}       Send mousedown event to the current url
  ${Color.Gray('wait')}      ${Color.Blue('ms')}        Wait for the given milliseconds
  ${Color.Gray('close')}     ${Color.Blue('')}          Close drift process

Flags:

  ${Color.Gray('window')}    ${Color.Blue('')}          Open chrome with desktop window
  ${Color.Gray('incognto')}  ${Color.Blue('')}          Open chrome in incognito mode
  ${Color.Gray('devtools')}  ${Color.Blue('')}          Open chrome with devtools
  ${Color.Gray('verbose')}   ${Color.Blue('')}          Emit chrome logs to stdout
  ${Color.Gray('fail')}      ${Color.Blue('')}          Close drift on any error
  ${Color.Gray('help')}      ${Color.Blue('')}          Show this help message

`)
}

// ------------------------------------------------------------------------
// Commands
// ------------------------------------------------------------------------

const commands = Commands.parse()

// ------------------------------------------------------------------------
// Help
// ------------------------------------------------------------------------

if (has_command('help', commands)) {
  banner()
  help()
  process.exit(0)
}

// --------------------------------------------------------------------
// Banner
// --------------------------------------------------------------------

if (commands.length === 0) {
  banner()
}

// --------------------------------------------------------------------
// Connect
// --------------------------------------------------------------------

log('drift', 'connecting to chrome')
const incognito = has_command('incognito', commands)
const verbose = has_command('verbose', commands)
const devtools = has_command('devtools', commands)
const headless = !has_command('window', commands)
const fail = has_command('fail', commands)
const user = user_dir(commands)

const repl = new Repl()
const browser = await ChromeStart.start({ user, headless, verbose, incognito, devtools })
const session = new Session(await browser.webSocketDebuggerUrl, repl)
session.on('close', async (code) => {
  await browser.close()
  process.exit(code)
})

browser.on('log', (content) => {
  repl.disable()
  log('verbose', Color.Blue(content))
  repl.enable()
})

browser.on('exit', async () => {
  await browser.close()
  process.exit(0)
})

session.on('error', async () => {
  if (!fail) return
  log('fail', 'close')
  await browser.close()
  process.exit(1)
})

// --------------------------------------------------------------------
// Commands
// --------------------------------------------------------------------

for (const command of commands) {
  switch (command.type) {
    case 'click': {
      log('viewport', command.x, command.y)
      await session.click(command.x, command.y)
      break
    }
    case 'close': {
      log('close')
      await browser.close()
      process.exit(0)
    }
    case 'css': {
      log('css', command.path)
      await session.css(command.path)
      break
    }
    case 'run': {
      log('run', command.path)
      await session.run(command.path)
      break
    }
    case 'position': {
      log('position', command.x, command.y)
      await session.position(command.x, command.y)
      break
    }
    case 'save': {
      log('save', command.path)
      await session.save(command.path)
      break
    }
    case 'size': {
      log('size', command.width, command.height)
      await session.size(command.width, command.height)
      break
    }
    case 'url': {
      log('url', command.url)
      await session.url(command.url)
      break
    }
    case 'wait': {
      log('wait', command.ms)
      await Delay.wait(command.ms)
      break
    }
  }
}

// --------------------------------------------------------------------
// Drift !!
// --------------------------------------------------------------------

log('drift', 'use ctrl+c or close() to exit')

repl.enable()

for await (const input of repl) {
  await session.evaluate(input)
}

await browser.close()
