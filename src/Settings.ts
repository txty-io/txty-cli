import * as path from "path";
import { globalConfig, projectConfig } from "./Config";
import { Logger } from "./Logger";

interface ICLIAuthCredentials {
    email?: string;
    secret?: string;
}

let cliAuthCredentials: ICLIAuthCredentials | null = null;

const Settings = {
    getProjectID: () => {
        return projectConfig.getKey("project_id");
    },

    getExportDirectory: () => {
        const projectPath = projectConfig.getKey("project_path");

        return path.join(projectPath ? projectPath : "", projectConfig.getKey("export_directory"));
    },

    getExportConfigID: () => {
        return projectConfig.getKey("export_configuration_id");
    },

    getAPIBaseURL: () => {
        return projectConfig.getKey("api_base_url");
    },

    getAPIVersion: () => {
        return projectConfig.getKey("api_version");
    },

    getProjectPath: () => {
        return projectConfig.getKey("project_path");
    },

    setAuthCredentialsPassedViaCLI(options: ICLIAuthCredentials) {
        cliAuthCredentials = options;
    },

    getAuthEmail: () => {
        const authEmailCLI = cliAuthCredentials?.email;
        if (authEmailCLI) {
            return authEmailCLI;
        }

        const authEmailProjectConfig = projectConfig.getKey("_auth_email");
        if (authEmailProjectConfig) {
            Logger.warn(
                "WARNING: Save your auth email in the global config to keep it secure (learn more here: https://github.com/txty-io/txty-cli#authentication)."
            );
            return authEmailProjectConfig;
        }

        const authEmailGlobalConfig = globalConfig.getKey("auth_email");
        if (authEmailGlobalConfig) {
            return authEmailGlobalConfig;
        }
    },

    getAuthSecret: () => {
        const authSecretCLI = cliAuthCredentials?.secret;
        if (authSecretCLI) {
            return authSecretCLI;
        }

        const authSecretProjectConfig = projectConfig.getKey("_auth_secret");
        if (authSecretProjectConfig) {
            Logger.warn(
                "WARNING: Save your auth secret in the global config to keep it secure (learn more here: https://github.com/txty-io/txty-cli#authentication)."
            );
            return authSecretProjectConfig;
        }

        const authSecretGlobalConfig = globalConfig.getKey("auth_secret");
        if (authSecretGlobalConfig) {
            return authSecretGlobalConfig;
        }
    }
};

export { Settings };
