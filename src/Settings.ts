import * as path from "path";
import { projectConfig } from "./config";

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
    }
};

export { Settings };
