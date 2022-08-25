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
- [Testing](#testing)

## Commands

Drift accepts a sequence of commands at the command line. Each command is run in series and performs some action on the underlying Chrome instance. Once all commands have completed Drift will enter a interactive repl similar to the Chrome Developer Console. 

Typically one would use the `url` or `run` commands to start Drift, however it provides several other commands that can be useful in test automation workflows. The following commands are supported

```
Commands:

  url     url    Navigate to the given url.
  run     path   Runs a script in the current url.
  window         Run with desktop window.
  size    w h    Sets desktop window size.
  pos     x y    Sets desktop window position.
  click   x y    Send mousedown event to the current url.
  save    path   Save current page as png, jpeg or pdf format.
  user    path   Sets the chrome user data directory.
  wait    ms     Wait for the given milliseconds.
  help           Lists available commands.
  close          Closes the drift process.
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