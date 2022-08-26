<div align='center'>

<h1>Drift</h1>

<p>Run Chrome from the Terminal</p>

<img src=".build/assets/drift.png"></img>

[![npm version](https://badge.fury.io/js/%40sinclair%2Fdrift.svg)](https://badge.fury.io/js/%40sinclair%2Fdrift)

</div>

## Install

```bash
$ npm install -g @sinclair/drift 
```

## Usage

```bash
$ drift url http://localhost:5000
```

## Overview

Drift is a command line tool that integrates the Chrome Developer Console into the terminal. It provides an interactive repl that allows code to be executed in a remote Chrome instance and pipes browser logging back over stdout. It is built to allow for non visual browser functionality (such as WebRTC and IndexedDB) to be developed and tested entirely within a terminal window.

Drift is designed to be a Node like tool for running JavaScript in constrained browser environments. It can be useful for general purpose scripting, browser automation workflows and testing browser code within CI environments.

License MIT

## Contents

- [Install](#Install)
- [Commands](#Commands)
- [Examples](#Examples)
- [Testing](#Testing)
- [Demo](#Demo)
- [Contribute](#Contribute)

## Commands

Drift provides the following command line interface.

```
Format:

  $ drift [...command | flag]

Examples:

  $ drift url https://domain.com
  $ drift run script.ts
  $ drift url https://domain.com run script.ts
  $ drift url https://domain.com wait 1000 save screenshot.png
  $ drift window devtools url https://domain.com

Commands:

  url      endpoint  Navigate chrome to the given endpoint
  run      path      Runs a script in the current url
  size     w h       Sets desktop window size
  pos      x y       Sets desktop window position
  save     path      Save current page as png, jpeg or pdf format
  user     path      Sets the chrome user data directory
  click    x y       Send mousedown event to the current url
  wait     ms        Wait for the given milliseconds
  close              Close drift process

Flags:

  window             Open chrome with desktop window
  incognto           Open chrome in incognito mode
  devtools           Open chrome with devtools
  verbose            Emit chrome logs to stdout
  fail               Close drift on any error
  help               Show this help message


```

## Examples

The following are some examples

```bash
# starts with interactive repl

$ drift
```
```bash
# opens github.com

$ drift url http://github.com
```

```bash
# runs index.ts

$ drift run index.ts
```

```bash
# opens a window, runs index.ts, waits 5 seconds then closes

$ drift window run index.ts wait 5000 close
```

```bash
# opens github.com, waits 4 seconds then takes a screenshot

$ drift url https://github.com wait 4000 save screenshot.png
```

## Testing

Drift modifies the `window.close(...)` function to allow browser scripts to terminate the Drift process from within a page. Scripts can call `window.close(...)` with an optional exit code. This functionality allows Drift to be used in CI environments that interpret non zero exit codes as errors.

```typescript
test().then(() => window.close(0)).catch(() => window.close(1))
```

Which can be run on CI environments with the following.

```bash
$ drift run test.ts
```

## Demo

The following demonstrates using Drift to automate Chrome in the Terminal

![Drift Demo](.build/assets/drift.gif "Drift Demo")

## Contribute

Drift is open to community contribution. Please ensure you submit an open issue before submitting a pull request. The Drift project preferences open community discussion prior to accepting new features.