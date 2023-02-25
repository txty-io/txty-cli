# Txty CLI

![license](https://img.shields.io/github/license/txty-io/txty-cli?style=flat-square)
![release](https://img.shields.io/github/package-json/v/txty-io/txty-cli?style=flat-square)


**The official command-line tool to interact with [Txty](https://texterify.com).**

<p align="center">
    <img src="https://github.com/txty-io/txty-cli/blob/c35ac6636be1115c58012232fd7444f9718cdb9b/preview.gif" />
</p>

This extension allows you to add keys, download your translations and much more without leaving your terminal.

For more information about Txty visit https://github.com/txty-io/texterify.

<h2 id="getting-started">🚀 Getting started</h2>

```sh
npm install -g @txty-io/txty-cli

# or

yarn global add @txty-io/txty-cli
```

and then

```sh
txty -h
```

<h2 id="authentication">🔑 Authentication</h2>

The `txty` utility can be configured by placing a `.txty.json` in your home folder.

### Authenticate via global config

The authentication against the Txty server is configured in the global `~/.txty.json` configuration file. Make sure to always keep the global config file private.

Example `~/.txty.json`

```json
{
    "auth_email": "email@example.com",
    "auth_secret": "aG2DzuoWG30a3IHwOKMQUg"
}
```

| Option      | Description                                                                                     | Optional |
| ----------- | ----------------------------------------------------------------------------------------------- | -------- |
| auth_email  | The email you use to log in on Txty.                                                       | No       |
| auth_secret | An access token you can generate at https://app.txty.io/dashboard/settings/access-tokens. | No       |

### Authenticate by passing auth credentials to commands

You can also pass the auth credentials to the CLI tool by adding `--auth-email=<value>` and `--auth-secret=<value>` to your command.

CLI passed auth credentials have precedence over those defined in the global config.

<h2 id="project-config">⚙️ Project Config</h2>

It is recommended that you put the project config `txty.json` in the root directory of your project (otherwise you need to set `project_path`).

No sensitive data should be stored in your project config so you can safely check this file in with your code and share it with others.

Example `txty.json`

```json
{
    "api_base_url": "https://app.txty.io/api",
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

<h2 id="upgrade">🛠️ Upgrade</h2>

```sh
yarn global upgrade @txty-io/txty-cli@latest

# or

npm install -g @txty-io/txty-cli@latest
```

<h2 id="contributing">🤝 Contributing</h2>

Start the watcher with `yarn start:watcher` so your source code gets automatically compiled.
Use the `yarn start` command to run the program.

### Example command for testing

```
yarn start add "my.key" "my description" --auth-email=test1@txty.io --auth-secret=SECRET
```

### Release a new version

Run the following command:

```
yarn release
```

<h2 id="security">🔒 Security</h2>

Found a security issue? Please **don't** create an issue on GitHub. Instead send an email with your findings to [security@texterify.com](mailto:security@texterify.com) so a bugfix can be developed before the security flaw is publicly disclosed.

<h2 id="license">📝 License</h2>

![license](https://img.shields.io/github/license/txty-io/txty-cli?style=flat-square)

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
