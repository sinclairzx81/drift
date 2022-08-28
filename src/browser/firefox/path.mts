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

import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

export namespace FirefoxPath {
  function getOSXPath() {
    const toExec = '/Contents/MacOS/Firefox'
    const regPath = `/Applications/Firefox.app${toExec}`
    const mdFindCmd = 'mdfind \'kMDItemDisplayName == "Firefox" && kMDItemKind == Application\''
    if (existsSync(regPath)) return regPath
    return execSync(mdFindCmd, { encoding: 'utf-8' }).trim()
  }

  function getWinPath(): string {
    const winSuffix = '\\Mozilla Firefox\\firefox.exe'
    const prefixes: string[] = [`${process.env.LOCALAPPDATA}${winSuffix}`, `${process.env.PROGRAMFILES}${winSuffix}`, `${process.env['PROGRAMFILES(X86)']}${winSuffix}`]
    if (existsSync(prefixes[0])) return prefixes[0]
    if (existsSync(prefixes[1])) return prefixes[1]
    if (existsSync(prefixes[2])) return prefixes[2]
    throw Error('WIN: Cannot locate chrome path')
  }

  function getLinuxPath(): string {
    return execSync('which firefox', { encoding: 'utf-8' }).trim()
  }

  export function get() {
    switch (process.platform) {
      case 'darwin':
        return getOSXPath()
      case 'win32':
        return getWinPath()
      default:
        return getLinuxPath()
    }
  }
}
