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

import * as fs from 'fs'

export namespace DevToolsCodeGen {
  // https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/json/js_protocol.json

  const protocol = JSON.parse(fs.readFileSync('.build/codegen/devtools/protocol.json', 'utf8'))

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
  const removeNewlines = (str: string) => str.replace(/\n/g, ' ')

  function generateType(type: any): string {
    if (type.type === 'any') return 'any'
    if (type.$ref) return type.$ref
    if (type.type === 'string' && type.enum === undefined) return 'string'
    if (type.type === 'boolean') return 'boolean'
    if (type.type === 'number') return 'number'
    if (type.type === 'integer') return 'number'
    if (type.type === 'binary') return 'Uint8Array'
    if (type.type === 'string' && Array.isArray(type.enum)) return type.enum.map((item: any) => `"${item}"`).join(' | ')
    if (type.type === 'array') return type.items ? `${generateType(type.items)}[]` : `any[]`
    if (type.type === 'object') {
      if (!type.properties) return `{[key: string]: any}`
      const properties = type.properties
        .map((property: any) => {
          return property.optional ? `${property.name}?: ${generateType(property)}` : `${property.name}: ${generateType(property)}`
        })
        .map((property: any) => `  ${property}`)
      return `{ ${properties.join(',').trim()} }`
    }
    throw Error(`Unexpected Type: ${JSON.stringify(type)}`)
  }

  function* generateTypeDefinitions(domain: any): Generator<string> {
    if (domain.types) {
      for (const type of domain.types) {
        yield type.description ? `/** ${removeNewlines(type.description)} */` : ''
        yield `export type ${type.id} = ${generateType(type)}`
      }
    }
  }

  export function generateEventType(event: any) {
    if (!event.parameters) return `{[key: string]: any}`
    const properties = event.parameters
      .map((property: any) => {
        return property.optional ? `${property.name}?: ${generateType(property)}` : `${property.name}: ${generateType(property)}`
      })
      .map((property: any) => `  ${property}`)
    return `{ ${properties.join(',').trim()} }`
  }

  function* generateEventTypes(domain: any): Generator<string> {
    if (domain.events) {
      for (const event of domain.events) {
        const typeName = `${capitalize(event.name)}Event`
        const typeDesc = generateEventType(event)
        yield `export type ${typeName} = ${typeDesc}`
      }
    }
  }

  export function generateRequestType(command: any) {
    const properties = command.parameters
      ? command.parameters
          .map((property: any) => {
            return property.optional ? `${property.name}?: ${generateType(property)}` : `${property.name}: ${generateType(property)}`
          })
          .map((property: any) => `  ${property}`)
      : ['']
    const typeName = `${capitalize(command.name)}Request`
    const typeDesc = `{ ${properties.join(',').trim()} }`
    return `export type ${typeName} = ${typeDesc}`
  }

  export function generateResponseType(command: any) {
    const properties = command.returns
      ? command.returns
          .map((property: any) => {
            return property.optional ? `${property.name}?: ${generateType(property)}` : `${property.name}: ${generateType(property)}`
          })
          .map((property: any) => `  ${property}`)
      : ['']
    const typeName = `${capitalize(command.name)}Response`
    const typeDesc = `{ ${properties.join(',').trim()} }`
    return `export type ${typeName} = ${typeDesc}`
  }

  export function* generateRequestResponseTypes(domain: any) {
    if (domain.commands) {
      for (const command of domain.commands) {
        yield generateRequestType(command)
        yield generateResponseType(command)
      }
    }
  }

  export function* generateNamespace(domain: any): Generator<string> {
    yield `export namespace ${domain.domain} {`
    yield* generateTypeDefinitions(domain)
    yield* generateEventTypes(domain)
    yield* generateRequestResponseTypes(domain)
    yield `}`
  }

  export function* generateConstructor(domain: any) {
    yield `constructor(private readonly adapter: DevToolsAdapter) {`
    yield `this.events = new Events()`
    if (domain.events) {
      for (const event of domain.events) {
        yield `this.adapter.on('${domain.domain}.${event.name}', event => this.events.send('${event.name}', event))`
      }
    }
    yield `}`
  }

  export function* generateClassMethod(domainName: string, command: any): Generator<string> {
    const requestType = `${domainName}.${capitalize(command.name)}Request`
    const responseType = `${domainName}.${capitalize(command.name)}Response`
    const targetName = `${domainName}.${command.name}`
    yield command.description ? `/** ${removeNewlines(command.description)} */` : ''
    yield `public ${command.name}(request: ${requestType}): Promise<${responseType}>{`
    yield `return this.adapter.call('${targetName}', request)`
    yield `}`
  }
  export function* generateEventOn(domainName: string, event: any): Generator<string> {
    const eventType = `${domainName}.${capitalize(event.name)}Event`
    yield event.description ? `/** ${removeNewlines(event.description)} */` : ''
    yield `public on(event: '${event.name}', handler: EventHandler<${eventType}>): EventListener`
  }

  export function* generateEventOnce(domainName: string, event: any): Generator<string> {
    const eventType = `${domainName}.${capitalize(event.name)}Event`
    yield event.description ? `/** ${removeNewlines(event.description)} */` : ''
    yield `public once(event: '${event.name}', handler: EventHandler<${eventType}>): EventListener`
  }
  export function* generateClass(domain: any): Generator<string> {
    yield `export class ${domain.domain} {`
    yield 'private readonly events: Events'
    yield* generateConstructor(domain)
    if (domain.commands) {
      for (const command of domain.commands) {
        yield* generateClassMethod(domain.domain, command)
      }
    }
    if (domain.events) {
      for (const event of domain.events) {
        yield* generateEventOn(domain.domain, event)
      }
      yield `public on(event: string, handler: EventHandler<any>): EventListener {`
      yield `  return this.events.on(event, handler)`
      yield `}`
      for (const event of domain.events) {
        yield* generateEventOnce(domain.domain, event)
      }
      yield `public once(event: string, handler: EventHandler<any>): EventListener {`
      yield `  return this.events.once(event, handler)`
      yield `}`
    }
    yield `}`
  }

  function* generateDevTools(protocol: any): Generator<string> {
    yield `export class DevTools {`
    for (const domain of protocol.domains) {
      yield `public readonly ${domain.domain}: ${domain.domain}`
    }
    yield `constructor(private readonly adapter: DevToolsAdapter) {`
    for (const domain of protocol.domains) {
      yield `this.${domain.domain} = new ${domain.domain}(this.adapter)`
    }
    yield `}`
    yield `}`
  }

  function* generateImports() {
    yield `import { Events, EventHandler, EventListener } from '../events/index.mjs'`
    yield `import { DevToolsAdapter } from './adapter.mjs'`
  }

  function* generateInterface(protocol: any) {
    yield* generateImports()

    yield `export namespace DevToolsInterface {`
    for (const domain of protocol.domains) {
      yield* generateNamespace(domain)
    }
    for (const domain of protocol.domains) {
      yield* generateClass(domain)
    }
    yield* generateDevTools(protocol)
    yield '}'
  }

  function* generateContent(protocol: any) {
    const spaces: string[] = []
    for (const line of generateInterface(protocol)) {
      if (line.includes('}') && !line.includes('{')) spaces.shift()
      yield `${spaces.join('')}${line}`
      if (line.includes('{') && !line.includes('}')) spaces.push('    ')
    }
  }

  export function generate(target: string) {
    const content = [...generateContent(protocol)].join('\n')
    fs.writeFileSync(target, content, 'utf8')
    console.log(content)
  }
}
