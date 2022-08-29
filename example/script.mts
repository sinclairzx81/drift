// npm start run example/run.ts

import { Inner } from './inner/index.mjs'

const inner = new Inner()

export async function esm() {
  return 'esm modules working'
}

console.log(await esm())
