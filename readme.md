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

Drift is a command line tool that integrates the Chrome Developer Console into the terminal. It is built upon the Chrome DevTools Protocol and implements an interactive repl for running code in remote Chrome instances and sends browser logging to stdout. It is built to enable browser functionality to be developed and tested entirely within a terminal window.

Drift is designed to be a Node like tool for dynamically running JavaScript in constrained browser environments. It can be used for browser automation, testing code in CI or used as a general purpose scripting environment.

License MIT

## Contents

- [Install](#Install)
- [Commands](#Commands)
- [Examples](#Examples)
- [Runtime](#Runtime)
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
  $ drift url https://domain.com wait 1000 save image.png
  $ drift window devtools url https://domain.com

Commands:

  url         url         Navigate page to url endpoint
  run         path        Run script on current page
  css         path        Add style to current page
  save        path        Save current page as png, jpeg or pdf format
  user        path        Set chrome user data directory
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
  watch                   Reload page on file change
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

## Runtime

Drift adds the following API in the browser runtime environment.

```typescript
declare global {
    /** Drift Runtime. Only available if webpage run via Drift command line */
    Drift: {
      /** Command line arguments */
      args: string[]
      /** Wait for milliseconds to elapse */
      wait: (ms: number) => Promise<void>
      /** Close drift */
      close(exitcode?: number): void
      /** Reload the current page */
      reload(): void
      /** Navigate page to url endpoint */
      url(url: string): void
      /** Run script on current page */
      run(path: string): void
      /** Add style to current page */
      css(path: string): void
      /** Set desktop window position */
      position(x: number, y: number): void
      /** Set desktop window size */
      size(w: number, h: number): void
      /** Send mousedown event current page */
      click(x: number, y: number): void
      /** Save current page as png, jpeg or pdf format */
      save(path: string): void
    }
}

```

## Testing

Drift modifies the `window.close(...)` function to allow browser scripts to terminate the Drift process from within a page. Scripts can call `window.close(...)` with an optional exit code. This functionality allows Drift to be used in CI environments that interpret non zero exit codes as errors.

```typescript
test().then(() => Drift.close(0)).catch(() => Drift.close(1))
```

Which can be run on CI environments with the following.

```bash
$ drift run test.ts
```

## Demo

The following demonstrates using Drift to operate Chrome via the Terminal

![Drift Demo](.build/assets/drift.gif "Drift Demo")

## Contribute

Drift is open to community contribution. Please ensure you submit an open issue before submitting a pull request. The Drift project preferences open community discussion prior to accepting new features.