import { Flags } from "@oclif/core";
import * as fs from "fs";
import * as nconf from "nconf";
import * as path from "path";
import { projectConfig } from "../Config";

export const project_path_flag = Flags.string({
    description: "The path to the project where the config file is located."
});

export function handleProjectPathFlag(projectPath: string | undefined) {
    if (projectPath) {
        let configFilePath = path.join(projectPath, "txty.json");
        if (!fs.existsSync(configFilePath)) {
            configFilePath = path.join(projectPath, "texterify.json");
        }
        const newProjectStore = new nconf.Provider();
        newProjectStore.file({ file: configFilePath });
        projectConfig.setStore(newProjectStore);
        projectConfig.setKey("project_path", projectPath);
    }
}
