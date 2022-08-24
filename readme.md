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

## Example

```bash
$ drift url http://localhost:5000
```

## Overview

Drift is a command line tool that integrates the Chrome Developer Console into the terminal. It provides an interactive repl that allows code to be executed in a remote Chrome instance and pipes browser logging back over stdout. It is built to allow for non visual browser functionality (such as WebRTC and IndexedDB) to be developed and tested entirely from within the terminal.

Drift is designed to be a Node like tool for running JavaScript in constrained browser environments. It can be useful for general purpose scripting, browser automation workflows and testing browser code within CI environments.

License MIT

## Contents

- [Install](#install)
- [Commands](#commands)
- [Examples](#examples)
- [Testing](#testing)

## Commands

Drift accepts a sequence of commands at the command line. Each command is run in turn and performs some action on the underlying Chrome instance. Typically one would use the `url` or `run` command to start an application, however Drift provides several other commands that can be used in automation workflows.

```bash
$ drift [...command]
```

The following commands are supported

```typescript
┌────────────────────────┬─────────────────────────────────────────────────────────────────┐
│ command                │ description                                                     │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ url <url>              │ Loads this Url                                                  │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ run <path>             │ Loads a script into the current page                            │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ window                 │ Run with a chrome window                                        │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ size <w> <h>           │ Sets the chrome window size                                     │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ pos <x> <y>            │ Sets the chrome window position                                 │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ click <x> <y>          │ Send mousedown click event to the current page                  │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ save <path>            │ Save current page as png, jpeg or pdf format                    │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ user <path>            │ Sets the chrome user data directory                             │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ wait <ms>              │ Wait for the given milliseconds                                 │
├────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ close                  │ Closes the drift process                                        │
└────────────────────────┴─────────────────────────────────────────────────────────────────┘
```

## Examples

The following are a few examples

```bash
# starts the drift repl.

$ drift
```
```bash
# loads github.com.

$ drift url http://github.com
```

```bash
# loads and executes index.ts.

$ drift run index.ts
```

```bash
# starts a window, executes index.ts, waits 5 seconds then closes.

$ drift window run index.ts wait 5000 close
```

```bash
# loads github.com, waits 4 seconds then takes a screenshot.

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