"use strict";
import * as nconf from "nconf";
import * as os from "os";
import * as path from "path";

const LOGGING_PREFIX: string = "[CONFIG]";

function handleProgramOptions(program: any) {
    if (program.projectPath) {
        const configFilePath = path.join(program.projectPath, "texterify.json");
        console.log(LOGGING_PREFIX, "Setting config to:", configFilePath);
        const newProjectStore = new nconf.Provider();
        newProjectStore.file({ file: configFilePath });
        projectConfig.setStore(newProjectStore);
        projectConfig.setKey("project_path", program.projectPath);
    }
}

class Config {
    private store: any;

    constructor(store: any) {
        this.store = store;
    }

    setStore = (store: any) => {
        this.store = store;
    }

    /**
     * Sets the value for a key.
     */
    setKey = (key: string, value: any) => {
        console.log(LOGGING_PREFIX, `Setting key "${key}" to value "${value}"`);
        this.store.set(key, value);
    }

    /**
     * Returns the value for a key.
     */
    getKey = (key: string): string => {
        const value = this.store.get(key);
        console.log(LOGGING_PREFIX, `Getting value of key "${key}": ${value}`);

        return value;
    }

    /**
     * Persists the config to the disk.
     */
    saveConfig = () => {
        this.store.save(function (err: any) {
            if (err) {
                console.error(LOGGING_PREFIX, err);
            }
        });
    }
}

const homedir: string = os.homedir();
const globalSettingsFileName = ".texterify.json";
const globalSettingsFile = path.join(homedir, globalSettingsFileName);
const projectSettingsFileName = "texterify.json";
const projectSettingsFile = path.join(process.cwd(), projectSettingsFileName);

console.log(LOGGING_PREFIX, "Home directory:", homedir);
console.log(LOGGING_PREFIX, "Reading global config from:", globalSettingsFile);
console.log(LOGGING_PREFIX, "Reading project config from:", projectSettingsFile);

const globalStore = new nconf.Provider();
globalStore.file({ file: globalSettingsFile });

const projectStore = new nconf.Provider();
projectStore.file({ file: projectSettingsFile });

const globalConfig = new Config(globalStore);
const projectConfig = new Config(projectStore);

export {
    globalConfig,
    projectConfig,
    handleProgramOptions
};
