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

import { Platform, Color, Watch, Chrome, ChromeStart, Session, Repl, Commands, Delay, ArgsCommand, WatchCommand, Command, UserCommand } from './index.mjs'
import * as Fs from 'node:fs'
import * as Path from 'node:path'

// ------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------

/** Checks if command exists */
function has_command(type: Command['type'], commands: Command[]) {
  return commands.find((command) => command.type === type) !== undefined
}

/** Gets the command */
function get_command_args(commands: Command[]): string[] {
  const command = commands.find((command) => command.type === 'args') as ArgsCommand | undefined
  return command ? command.args : []
}

/** Returns all watch paths */
function get_watch_paths(commands: Command[]): string[] {
  if (!has_command('watch', commands)) return []
  return commands.reduce((acc, command) => {
    switch (command.type) {
      case 'watch':
        return [...acc, ...command.paths]
      case 'run':
        return [...acc, command.path]
      case 'css':
        return [...acc, command.path]
      default:
        return acc
    }
  }, [] as string[])
}

/** Resolves the chrome user directory. Will default to node_modules directory if not specified. */
function get_user_dir(commands: Command[]) {
  const command = commands.find((command) => command.type === 'user') as UserCommand | undefined
  if (command === undefined) return Path.join(Platform.resolveDirname(import.meta.url), 'user')
  return Path.resolve(command.path)
}

/** Resolves the current package version */
function version() {
  const path = Path.join(Platform.resolveDirname(import.meta.url), 'package.json')
  if (!Fs.existsSync(path)) return Color.White('0.8.10')
  const packageJson = JSON.parse(Fs.readFileSync(path, 'utf-8'))
  return Color.White(packageJson.version)
}

/** Prints standard command message */
function log(command: string, ...params: any[]) {
  console.log(Color.Gray(command), ...params)
}

/** Reloads the page then re-runs the run and css commands */
async function reload(session: Session, commands: Command[]) {
  log('reload')
  await session.reload()
  for (const command of commands) {
    switch (command.type) {
      case 'run': {
        await session.run(command.path)
        break
      }
      case 'css': {
        await session.css(command.path)
        break
      }
    }
  }
}

/** Closes handles and terminates the process */
async function close(browser: Chrome, watch: Watch, code: number) {
  watch.close()
  await browser.close()
  process.exit(code)
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

  $ drift [...command]

Examples:

  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')}
  $ drift ${Color.Gray('run')} ${Color.Blue('script.ts')}
  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')} ${Color.Gray('run')} ${Color.Blue('script.ts')}
  $ drift ${Color.Gray('url')} ${Color.Blue('https://domain.com')} ${Color.Gray('wait')} ${Color.Blue('1000')} ${Color.Gray('save')} ${Color.Blue('image.png')}
  $ drift ${Color.Gray('window')} ${Color.Gray('devtools')} ${Color.Gray('url')} ${Color.Blue('https://domain.com')}

Commands:

  ${Color.Gray('url')}         ${Color.Blue('url')}         Load page
  ${Color.Gray('run')}         ${Color.Blue('path')}        Add script to page
  ${Color.Gray('css')}         ${Color.Blue('path')}        Add style to page
  ${Color.Gray('save')}        ${Color.Blue('path')}        Save page as image or pdf
  ${Color.Gray('args')}        ${Color.Blue('[...args]')}   Adds args to Drift.args
  ${Color.Gray('watch')}       ${Color.Blue('[...path]')}   Watch and reload
  ${Color.Gray('user')}        ${Color.Blue('path')}        User directory
  ${Color.Gray('mousedown')}   ${Color.Blue('x y')}         Send mousedown event
  ${Color.Gray('position')}    ${Color.Blue('x y')}         Desktop window position
  ${Color.Gray('size')}        ${Color.Blue('w h')}         Desktop window size
  ${Color.Gray('wait')}        ${Color.Blue('ms')}          Wait timeout
  ${Color.Gray('reload')}      ${Color.Blue('')}            Reload page
  ${Color.Gray('close')}       ${Color.Blue('')}            Close drift

Flags:

  ${Color.Gray('window')}      ${Color.Blue('')}            Open window
  ${Color.Gray('devtools')}    ${Color.Blue('')}            Open devtools
  ${Color.Gray('incognto')}    ${Color.Blue('')}            Open incognito
  ${Color.Gray('verbose')}     ${Color.Blue('')}            Log Chrome messages
  ${Color.Gray('reset')}       ${Color.Blue('')}            Reset user directory
  ${Color.Gray('fail')}        ${Color.Blue('')}            Close drift on exceptions
  ${Color.Gray('help')}        ${Color.Blue('')}            Show this help message

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

// ------------------------------------------------------------------------
// Clear
// ------------------------------------------------------------------------

if (has_command('reset', commands)) {
  const user_dir = get_user_dir(commands)
  log('reset', user_dir)
  if (Fs.existsSync(user_dir)) {
    Fs.rmSync(get_user_dir(commands), { recursive: true })
  }
}

// --------------------------------------------------------------------
// Browser
// --------------------------------------------------------------------

log('drift', 'connecting to chrome')

const incognito = has_command('incognito', commands)
const verbose = has_command('verbose', commands)
const devtools = has_command('devtools', commands)
const headless = !has_command('window', commands)
const fail = has_command('fail', commands)
const user = get_user_dir(commands)
const repl = new Repl()
const watch = new Watch()
const browser = await ChromeStart.start({ user, headless, verbose, incognito, devtools })

// --------------------------------------------------------------------
// Session
// --------------------------------------------------------------------

const webSocketDebuggerUrl = await browser.webSocketDebuggerUrl
const args = get_command_args(commands)
const session = new Session(repl, { webSocketDebuggerUrl, args })

session.on('reload', async () => {
  await reload(session, commands)
})

session.on('close', async (code) => {
  await close(browser, watch, code)
})

session.on('error', async () => {
  if (!fail) return
  log('fail', 'close')
  await close(browser, watch, 1)
})

browser.on('log', (content) => {
  repl.disable()
  log('verbose', Color.Blue(content))
  repl.enable()
})

browser.on('exit', async () => {
  await close(browser, watch, 0)
})

// --------------------------------------------------------------------
// Commands
// --------------------------------------------------------------------

for (const command of commands) {
  switch (command.type) {
    case 'close': {
      log('close')
      close(browser, watch, 0)
      break
    }
    case 'css': {
      log('css', command.path)
      await session.css(command.path)
      break
    }
    case 'mousedown': {
      log('mousedown', command.x, command.y)
      await session.mousedown(command.x, command.y)
      break
    }
    case 'position': {
      log('position', command.x, command.y)
      await session.position(command.x, command.y)
      break
    }
    case 'reload': {
      log('reload')
      await session.reload()
      break
    }
    case 'run': {
      log('run', command.path)
      await session.run(command.path)
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
// Watch
// --------------------------------------------------------------------

watch.on('change', () => reload(session, commands))

for (const path of get_watch_paths(commands)) {
  watch.add(path)
}

// --------------------------------------------------------------------
// Drift !!
// --------------------------------------------------------------------

log('drift', 'use ctrl+c or close() to exit')

repl.enable()

for await (const input of repl) {
  await session.evaluate(input)
}
