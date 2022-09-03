<div align='center'>

<h1>Drift</h1>

<p>Run Chrome from the Terminal</p>

<img src=".build/assets/drift.png"></img>

[![npm version](https://badge.fury.io/js/%40sinclair%2Fdrift.svg)](https://badge.fury.io/js/%40sinclair%2Fdrift)
[![GitHub CI](https://github.com/sinclairzx81/drift/workflows/GitHub%20CI/badge.svg)](https://github.com/sinclairzx81/drift/actions)

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

Drift is a command line tool that integrates the Chrome Developer Console into the terminal. It is built upon the Chrome DevTools Protocol and implements an interactive repl for running code in remote Chrome instances. Drift enables browser functionality to be developed and tested entirely from within a terminal window.

Drift works similar to Node but runs code in constrained browser environments. It can be used for browser automation, running browser code in CI environments or used as a general purpose scripting tool.

License MIT

## Contents

- [Install](#Install)
- [Commands](#Commands)
- [Examples](#Examples)
- [Testing](#Testing)
- [Contribute](#Contribute)

## Commands

The Drift CLI accepts a series of commands which are run in sequence against a sandboxed Chrome instance. When all commands have completed, Drift will enter an interactive repl similar to the Chrome DevTools Console. 

The following is the Drift command line interface
```
Format:

  $ drift [...command | flag]

Examples:

  $ drift url https://domain.com
  $ drift run script.ts
  $ drift url https://domain.com run script.ts
  $ drift url https://domain.com wait 1000 save image.png
  $ drift window devtools url https://domain.com

Commands:

  url         url         Navigate page to url endpoint
  run         path        Run script on current page
  css         path        Add style to current page
  save        path        Save current page as png, jpeg or pdf format
  user        path        Set chrome user data directory
  args        [...argv]   Adds command line args to Drift.argv
  watch       [...path]   Reload on save for run, css and additional paths
  position    x y         Set desktop window position
  size        w h         Set desktop window size
  click       x y         Send mousedown event current page
  wait        ms          Wait for milliseconds to elapse
  reload                  Reload the current page
  close                   Close drift

Flags:

  window                  Open chrome with window
  devtools                Open chrome with devtools
  incognto                Open chrome with incognito
  verbose                 Send chrome logs to stdout
  fail                    Close drift on exceptions
  help                    Show this help message


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

When testing browser code in CI environments, call `Drift.close(...)` within the code to terminate the process with a non zero exit code on errors. CI environments will interpret this is a failed process.

```typescript
test().then(() => Drift.close(0)).catch(() => Drift.close(1))
```

Which can be run on CI environments with the following.

```bash
$ drift run test.ts
```

## Contribute

Drift is open to community contribution. Please ensure you submit an open issue before submitting a pull request. The Drift project preferences open community discussion prior to accepting new features.