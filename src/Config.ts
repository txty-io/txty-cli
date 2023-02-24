import * as nconf from "nconf";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";

class Config {
    private store: nconf.Provider;

    constructor(store: nconf.Provider) {
        this.store = store;
    }

    setStore = (store: nconf.Provider) => {
        this.store = store;
    };

    setKey = (key: string, value: any) => {
        this.store.set(key, value);
    };

    getKey = (key: string) => {
        return this.store.get(key);
    };

    saveConfig = () => {
        this.store.save((error: any) => {
            if (error) {
                console.error(error);
            }
        });
    };
}

const homedir = os.homedir();

let globalSettingsFileName = ".txty.json";
let globalSettingsFile = path.join(homedir, globalSettingsFileName);
if (!fs.existsSync(globalSettingsFile)) {
    globalSettingsFileName = ".texterify.json";
    globalSettingsFile = path.join(homedir, globalSettingsFileName);
}

let projectSettingsFileName = "txty.json";
let projectSettingsFile = path.join(process.cwd(), projectSettingsFileName);
if (!fs.existsSync(projectSettingsFile)) {
    projectSettingsFileName = "texterify.json";
    projectSettingsFile = path.join(homedir, projectSettingsFileName);
}

const globalStore = new nconf.Provider();
globalStore.file({ file: globalSettingsFile });

const projectStore = new nconf.Provider();
projectStore.file({ file: projectSettingsFile });

const globalConfig = new Config(globalStore);
const projectConfig = new Config(projectStore);

export { globalConfig, projectConfig };
