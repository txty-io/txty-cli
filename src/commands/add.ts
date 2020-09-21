import { Command, flags } from "@oclif/command";
import { ErrorUtils } from "../api/ErrorUtils";
import { KeysAPI } from "../api/KeysAPI";
import { Logger } from "../Logger";
import { Settings } from "../Settings";
import { Validators } from "../Validators";
import { showErrorFixSuggestions } from "../Suggestions";
import { projectConfig } from "../Config";
import * as nconf from "nconf";
import * as path from "path";

export default class Add extends Command {
    static description = "add a new key";

    static flags = {
        help: flags.help({ char: "h" }),
        "project-path": flags.string(),
        description: flags.string()
    };

    static args = [{ name: "name", required: true }, { name: "content" }];

    static examples = [
        '$ texterify add "app.title" "MyApp" --description "The name of the app."',
        '$ texterify add "app.description" "My app description"'
    ];

    async run() {
        const { args, flags } = this.parse(Add);

        if (flags["project-path"]) {
            const configFilePath = path.join(flags["project-path"], "texterify.json");
            const newProjectStore = new nconf.Provider();
            newProjectStore.file({ file: configFilePath });
            projectConfig.setStore(newProjectStore);
            projectConfig.setKey("project_path", flags["project-path"]);
        }

        const projectId = Settings.getProjectID();
        Validators.ensureProjectId(projectId);

        let response;
        try {
            response = await KeysAPI.createKey({
                projectId: projectId,
                name: args.name,
                description: flags.description || "",
                defaultLanguageTranslation: args.content
            });
        } catch (error) {
            Logger.error("Failed to add key.");
            showErrorFixSuggestions(error);
            Validators.exitWithError();
        }

        if (response?.errors) {
            ErrorUtils.getAndPrintErrors(response.errors);
            Validators.exitWithError();
        } else {
            Logger.success(`Successfully added key "${args.name}".`);
        }
    }
}
