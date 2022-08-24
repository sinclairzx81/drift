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

import { DevToolsInterface } from '../devtools/index.mjs'

export class ValueResolver {
  constructor(private readonly devtools: DevToolsInterface.DevTools) {}

  private isNumeric(str: string): boolean {
    return !isNaN(str as any) && !isNaN(parseFloat(str))
  }

  // ---------------------------------------------------------------------------------------------
  // Synthetic Types
  // ---------------------------------------------------------------------------------------------

  private createConstructor(name: string = '') {
    return Object.defineProperty(class {}, 'name', { value: name })
  }

  private createArrayConstructorInstance(name: string = '', entries: [DevToolsInterface.Runtime.PropertyDescriptor, any][]) {
    const constructor = Object.defineProperty(Array, 'name', { value: name })
    const instance = constructor()
    for (const [property, object] of entries.filter((x) => this.isNumeric(x[0].name))) {
      instance[parseInt(property.name)] = object
    }
    return instance
  }

  private createConstructorInstance(name: string = '', entries: [DevToolsInterface.Runtime.PropertyDescriptor, any][]) {
    const constructor = this.createConstructor(name)
    const instance = new constructor()
    for (const [property, object] of entries) {
      Object.defineProperty(instance, property.name, {
        writable: property.writable,
        configurable: property.configurable,
        enumerable: property.enumerable,
        value: object,
      })
    }
    return instance
  }

  // ---------------------------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------------------------

  private async resolveProperties(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<Array<[DevToolsInterface.Runtime.PropertyDescriptor, any]>> {
    const response = await this.devtools.Runtime.getProperties({ objectId: object.objectId!, ownProperties: true, generatePreview: true })
    if (!response || !response.result) return []
    return Promise.all(
      response.result.map(async (property: any) => {
        return [property, await this.resolveAny(property.value!, depth - 1)]
      }),
    ) as Promise<Array<[DevToolsInterface.Runtime.PropertyDescriptor, any]>>
  }

  private async resolvePlainObject(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    if (object.objectId === undefined) return {}
    const entries = await this.resolveProperties(object, depth)
    return this.createConstructorInstance(object.className, entries)
  }

  // ---------------------------------------------------------------------------------------------
  // Object Types
  // ---------------------------------------------------------------------------------------------

  private async resolveArray(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    if (object.objectId === undefined) return []
    const match = /.*\(([0-9]*)\)/.exec(object.description!)
    if (match === null || parseInt(match[1]) > 32) return `${object.description} [...]`
    const entries = await this.resolveProperties(object, depth)
    return this.createArrayConstructorInstance('Array', entries)
  }

  private async resolveArrayBuffer(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return this.createConstructorInstance('ArrayBuffer', [])
  }
  private async resolveDataView(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveDate(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return new Date(Date.parse(object.description!))
  }
  private async resolveError(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveIterator(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveGenerator(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveMap(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveNode(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveNull(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return null
  }
  private async resolvePromise(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveProxy(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveRegexp(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveSet(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }
  private async resolveTypedArray(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    if (object.objectId === undefined) return []
    const match = /.*\(([0-9]*)\)/.exec(object.description!)
    if (match === null || parseInt(match[1]) > 32) return `${object.description} [...]`
    const entries = await this.resolveProperties(object, depth)
    return this.createArrayConstructorInstance(object.className, entries)
  }
  private async resolveWeakMap(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }

  private async resolveWeakSet(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    return object.className
  }

  private async resolveObject(object: DevToolsInterface.Runtime.RemoteObject, depth: number): Promise<any> {
    switch (object.subtype) {
      case 'array':
        return await this.resolveArray(object, depth)
      case 'arraybuffer':
        return await this.resolveArrayBuffer(object, depth)
      case 'dataview':
        return await this.resolveDataView(object, depth)
      case 'error':
        return await this.resolveError(object, depth)
      case 'generator':
        return await this.resolveGenerator(object, depth)
      case 'iterator':
        return await this.resolveIterator(object, depth)
      case 'map':
        return await this.resolveMap(object, depth)
      case 'node':
        return await this.resolveNode(object, depth)
      case 'null':
        return await this.resolveNull(object, depth)
      case 'promise':
        return await this.resolvePromise(object, depth)
      case 'proxy':
        return await this.resolveProxy(object, depth)
      case 'regexp':
        return await this.resolveRegexp(object, depth)
      case 'set':
        return await this.resolveSet(object, depth)
      case 'typedarray':
        return await this.resolveTypedArray(object, depth)
      case 'weakmap':
        return await this.resolveWeakMap(object, depth)
      case 'weakset':
        return await this.resolveWeakSet(object, depth)
      default:
        return this.resolvePlainObject(object, depth)
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Primitives
  // ---------------------------------------------------------------------------------------------

  private async resolveBoolean(object: DevToolsInterface.Runtime.RemoteObject): Promise<any> {
    return object.value!
  }

  private async resolveBigInt(object: DevToolsInterface.Runtime.RemoteObject): Promise<any> {
    return `BigInt(${object.unserializableValue})`
  }

  private async resolveFunction(object: DevToolsInterface.Runtime.RemoteObject): Promise<any> {
    return new Function()
  }

  private async resolveNumber(object: DevToolsInterface.Runtime.RemoteObject): Promise<any> {
    return object.value!
  }

  private async resolveString(object: DevToolsInterface.Runtime.RemoteObject): Promise<any> {
    return object.value!
  }

  private async resolveSymbol(object: DevToolsInterface.Runtime.RemoteObject): Promise<any> {
    return object.value!
  }

  private async resolveUndefined(object: DevToolsInterface.Runtime.RemoteObject): Promise<any> {
    return undefined
  }

  private async resolveAny(object: DevToolsInterface.Runtime.RemoteObject, depth: number) {
    if (object === null) {
      return `null`
    }
    if (object === undefined) {
      return 'undefined'
    }
    if (object.type === 'object' && depth < 0) {
      return `${object.description}`
    }
    switch (object.type) {
      case 'bigint':
        return await this.resolveBigInt(object)
      case 'boolean':
        return await this.resolveBoolean(object)
      case 'function':
        return await this.resolveFunction(object)
      case 'number':
        return await this.resolveNumber(object)
      case 'object':
        return await this.resolveObject(object, depth)
      case 'string':
        return await this.resolveString(object)
      case 'symbol':
        return await this.resolveSymbol(object)
      case 'undefined':
        return await this.resolveUndefined(object)
      default:
        return `[unknown] ${object.type}`
    }
  }

  public async resolve(object: DevToolsInterface.Runtime.RemoteObject): Promise<any> {
    return await this.resolveAny(object, 2)
  }
}
