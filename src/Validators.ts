import { exit } from "process";
import { Logger } from "./Logger";
import * as fs from "fs";

const ERROR_EXIT_CODE = 1;

export const Validators = {
    ensureProjectId: (projectId: string) => {
        if (!projectId) {
            Logger.error(
                "No project ID set.\nSee https://github.com/chrztoph/texterify-cli#project-config for instructions on how to set it."
            );
        }
    },

    ensureExportConfigId: (exportConfigId: string) => {
        if (!exportConfigId) {
            Logger.error(
                "No export config ID set.\nSee https://github.com/chrztoph/texterify-cli#project-config for instructions on how to set it."
            );
            exit(ERROR_EXIT_CODE);
        }
    },

    ensureAPIBaseUrl: (apiBaseUrl: string) => {
        if (!apiBaseUrl) {
            Logger.error("Please specify the API base url in your local .texterify.json config (api_base_url)");
            exit(ERROR_EXIT_CODE);
        }
    },

    ensureAPIVersion: (apiVersion: string) => {
        if (!apiVersion) {
            Logger.error("Please specify the API version in your local .texterify.json config (api_version)");
            exit(ERROR_EXIT_CODE);
        }
    },

    ensureAuthEmail: (authEmail: string) => {
        if (!authEmail) {
            Logger.error("Please specify the auth email in ~/.texterify.json (auth_email)");
            exit(ERROR_EXIT_CODE);
        }
    },

    ensureAuthSecret: (authSecret: string) => {
        if (!authSecret) {
            Logger.error("Please specify the auth secret ~/.texterify.json (auth_secret)");
            exit(ERROR_EXIT_CODE);
        }
    },

    ensureFileExists: (configName: string, errorString: string) => {
        if (!fs.existsSync(configName)) {
            Logger.error(errorString, configName);
            exit(ERROR_EXIT_CODE);
        }
    },

    exitWithError: () => {
        exit(ERROR_EXIT_CODE);
    }
};
