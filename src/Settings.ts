import * as path from "path";
import { projectConfig } from "./Config";

const Settings = {
    getProjectID: () => {
        return projectConfig.getKey("project_id");
    },

    getExportDirectory: () => {
        const projectPath = projectConfig.getKey("project_path");

        return path.join(projectPath ? projectPath : "", projectConfig.getKey("export_directory"));
    },

    getExportType: () => {
        return projectConfig.getKey("export_type");
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
