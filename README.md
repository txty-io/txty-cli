# Texterify CLI

[![License](https://img.shields.io/github/license/chrztoph/texterify-cli.svg)](https://img.shields.io/github/license/chrztoph/texterify-cli.svg) [![Open Issues](https://img.shields.io/github/issues-raw/chrztoph/texterify-cli.svg)](https://img.shields.io/github/issues-raw/chrztoph/texterify-cli.svg)

**Official CLI to interact with Texterify.**

This extension allows you to add keys and download your translations without leaving your terminal.

For more information about Texterify visit https://github.com/texterify/texterify.

## Installation

```sh
yarn global add texterify
```

or

```sh
npm install -g texterify
```

## Authentication

The `texterify` utility can be configured by placing a `.texterify.json` in your home folder.

### Authenticate via global config

The authentication against the Texterify server is configured in the global `~/.texterify.json` configuration file. Make sure to always keep the global config file private.

Example `~/.texterify.json`

```json
{
    "auth_email": "email@example.com",
    "auth_secret": "aG2DzuoWG30a3IHwOKMQUg"
}
```

| Option      | Description                                                                                     | Optional |
| ----------- | ----------------------------------------------------------------------------------------------- | -------- |
| auth_email  | The email you use to log in on Texterify.                                                       | No       |
| auth_secret | An access token you can generate at https://app.texterify.com/dashboard/settings/access-tokens. | No       |

### Authenticate by passing auth credentials to commands

You can also pass the auth credentials to the CLI tool by adding `--auth-email=<value>` and `--auth-secret=<value>` to your command.

CLI passed auth credentials have precedence over those defined in the global config.

## Project Config

It is recommended that you put the project config `texterify.json` in the root directory of your project (otherwise you need to set `project_path`).

No sensitive data should be stored in your project config so you can safely check this file in with your code and share it with others.

Example `texterify.json`

```json
{
    "api_base_url": "https://app.texterify.com/api",
    "api_version": "v1",
    "project_id": "b53faf34-934a-491b-84aa-d880f3c2bce8",
    "export_configuration_id": "9bd1edfc-9d43-449d-9e51-7990630baf74",
    "export_directory": "translations",
    "project_path": ""
}
```

| Option                  | Description                                                                                                                  | Optional |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| api_base_url            | The path where the API is located usually ending in `/api`.                                                                  | No       |
| api_version             | The version of the API (for now only `v1` is available).                                                                     | No       |
| project_id              | The project you want to manage. The project ID can be found on the project overview site or in the URL of the project sites. | No       |
| export_configuration_id | The ID of the export configuration. This can also be configured with `--export-config-id` on the command line.               | No       |
| export_directory        | The directory where your translations will be exported to.                                                                   | No       |
| project_path            | The path to your project. This can also be configured with `--project-path` on the command line.                             | Yes      |

## Usage

If you have successfully configured your project you can try to do `texterify <command>` in the directory where you placed your project config. To get a list of all commands your current version supports try `texterify -h`.

## Upgrade

```sh
yarn global upgrade texterify@latest
```

```sh
npm install -g texterify@latest
```

## Contributing

Start the watcher with `yarn start:watcher` so your source code gets automatically compiled.
Use the `yarn start` command to run the program.

### Example command for testing

`yarn start add "my.key" "my description" --auth-email=test1@texterify.com --auth-secret=SECRET`

## Release a new version

Run the following commands:

```
yarn version
yarn release
```

## License

[![License](https://img.shields.io/github/license/chrztoph/texterify-cli.svg)](https://img.shields.io/github/license/chrztoph/texterify-cli.svg)

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
