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
  await shell('prettier --no-semi --single-quote --print-width 240 --trailing-comma all --write src .build example hammer.mjs tsconfig.json')
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
  await shell(`hammer run "example/index.mts user target/user ${params}" --dist target/example`)
}

// ---------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------

export async function build() {
  await clean()
  await shell('tsc -p src/tsconfig.json --outDir target/build --declaration')
  await folder('target/build').add('src/start.mjs')
  await folder('target/build').add('readme.md')
  await folder('target/build').add('license')
  await folder('target/build').add('package.json')
  await shell('cd target/build && npm pack')
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
