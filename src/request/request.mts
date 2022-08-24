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

import * as http from 'node:http'
import * as url from 'node:url'
export namespace Request {
  /** Http Get Request */
  export function get(endpoint: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: http.RequestOptions = {
        ...url.parse(endpoint),
        method: 'GET',
      }
      const req = http.request(options, (res) => {
        const buffers: Buffer[] = []
        res.on('data', (buffer) => buffers.push(buffer))
        res.on('error', (error) => reject(error))
        res.on('end', () => resolve(Buffer.concat(buffers).toString('utf-8')))
      })
      req.on('error', (error) => reject(error))
      req.end()
    })
  }
}
