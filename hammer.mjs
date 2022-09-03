import { DevToolsCodeGen } from './.build/codegen/devtools/index'
import { readFileSync } from 'node:fs'

// ---------------------------------------------------------------------
// Clean
// ---------------------------------------------------------------------

export async function clean() {
  await folder('target').delete()
}

// ---------------------------------------------------------------------
// Format
// ---------------------------------------------------------------------

export async function format() {
  await shell('prettier --no-semi --single-quote --print-width 180 --trailing-comma all --write src .build example hammer.mjs tsconfig.json')
}

// ---------------------------------------------------------------------
// Codegen
// ---------------------------------------------------------------------

export async function codegen() {
  DevToolsCodeGen.generate('src/devtools/devtools.mts')
}

// ---------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------

export async function start(...args) {
  const params = args.join(' ')
  await shell(`hammer run "example/start.mts user target/user ${params}" --dist target/example`)
}

// ---------------------------------------------------------------------
// Test
// ---------------------------------------------------------------------

export async function test() {
  await build()
  const params = `url http://google.com wait 1000 save ../assets/google.png wait 1000 close`
  await shell(`cd target/build && node drift.mjs user target/user ${params}`)
}

// ---------------------------------------------------------------------
// Parallel
// ---------------------------------------------------------------------

export async function parallel(...args) {
  const params = args.join(' ')
  await Promise.all([
    shell(`hammer run "example/index.mts user target/user ${params}" --dist target/parallel_example_1`),
    shell(`hammer run "example/index.mts user target/user ${params}" --dist target/parallel_example_2`),
    shell(`hammer run "example/index.mts user target/user ${params}" --dist target/parallel_example_3`),
    shell(`hammer run "example/index.mts user target/user ${params}" --dist target/parallel_example_4`),
  ])
}

// ---------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------

export async function build(target = 'target/build') {
  await clean()
  await shell(`tsc -p src/tsconfig.json --outDir ${target} --declaration`)
  await folder(target).add('src/runtime.d.ts')
  await folder(target).add('src/start.mjs')
  await folder(target).add('readme.md')
  await folder(target).add('license')
  await folder(target).add('package.json')
  await shell(`cd ${target} && npm pack`)
}

// ---------------------------------------------------------------------
// Install CLI
// ---------------------------------------------------------------------

export async function install_cli(target = 'target/build') {
  await build(target)
  const { version } = JSON.parse(readFileSync('package.json', 'utf8'))
  await shell(`cd ${target} && npm install -g sinclair-drift-${version}.tgz`)
}
// ---------------------------------------------------------------------
// Publish
// ---------------------------------------------------------------------

export async function publish(otp, target = 'target/build') {
  const { version } = JSON.parse(readFileSync('package.json', 'utf8'))
  await shell(`cd ${target} && npm publish sinclair-drift-${version}.tgz --access=public --otp ${otp}`)
}

// ---------------------------------------------------------------------
// Install Chrome
// ---------------------------------------------------------------------

export async function install_chrome_linux() {
  await shell('wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb')
  await shell('sudo apt install ./google-chrome-stable_current_amd64.deb')
}
