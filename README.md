texterify
=========

A CLI for Texterify

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/texterify.svg)](https://npmjs.org/package/texterify)
[![Downloads/week](https://img.shields.io/npm/dw/texterify.svg)](https://npmjs.org/package/texterify)
[![License](https://img.shields.io/npm/l/texterify.svg)](https://github.com/chrztoph/texterify-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g texterify
$ texterify COMMAND
running command...
$ texterify (-v|--version|version)
texterify/0.0.7 darwin-x64 node-v12.16.1
$ texterify --help [COMMAND]
USAGE
  $ texterify COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`texterify add NAME [DESCRIPTION]`](#texterify-add-name-description)
* [`texterify download [FILE]`](#texterify-download-file)
* [`texterify help [COMMAND]`](#texterify-help-command)
* [`texterify init`](#texterify-init)

## `texterify add NAME [DESCRIPTION]`

Uploads a new key to Texterify.

```
USAGE
  $ texterify add NAME [DESCRIPTION]

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  $ texterify add app.title "The name of the app."
  $ texterify add app.description
```

_See code: [src/commands/add.ts](https://github.com/chrztoph/texterify-cli/blob/v0.0.7/src/commands/add.ts)_

## `texterify download [FILE]`

describe the command here

```
USAGE
  $ texterify download [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/download.ts](https://github.com/chrztoph/texterify-cli/blob/v0.0.7/src/commands/download.ts)_

## `texterify help [COMMAND]`

display help for texterify

```
USAGE
  $ texterify help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_

## `texterify init`

Initializes the project with a config file.

```
USAGE
  $ texterify init

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/chrztoph/texterify-cli/blob/v0.0.7/src/commands/init.ts)_
<!-- commandsstop -->
