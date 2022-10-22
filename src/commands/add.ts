import { Command, Flags } from "@oclif/core";
import { ErrorUtils } from "../api/ErrorUtils";
import { KeysAPI } from "../api/KeysAPI";
import { Logger } from "../Logger";
import { Settings } from "../Settings";
import { Validators } from "../Validators";
import { showErrorFixSuggestions } from "../Suggestions";
import { projectConfig } from "../Config";
import * as nconf from "nconf";
import * as path from "path";
import { auth_email_flag } from "../flags/auth_email_flag";
import { auth_secret_flag } from "../flags/auth_secret_flag";
import { help_flag } from "../flags/help_flag";

export default class Add extends Command {
    static description = "add a new key with an optional default language translation content";

    static flags = {
        help: help_flag,
        "project-path": Flags.string(),
        description: Flags.string({ description: "Description of the key." }),
        "auth-email": auth_email_flag,
        "auth-secret": auth_secret_flag
    };

    static args = [{ name: "name", required: true }, { name: "content" }];

    static examples = [
        '$ texterify add "app.title" "MyApp" --description "The name of the app."',
        '$ texterify add "app.description" "My app description"'
    ];

    async run() {
        const { args, flags } = await this.parse(Add);

        if (flags["project-path"]) {
            const configFilePath = path.join(flags["project-path"], "texterify.json");
            const newProjectStore = new nconf.Provider();
            newProjectStore.file({ file: configFilePath });
            projectConfig.setStore(newProjectStore);
            projectConfig.setKey("project_path", flags["project-path"]);
        }

        const projectId = Settings.getProjectID();
        Validators.ensureProjectId(projectId);

        let response: any;
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
            Validators.exitWithError(this);
        }

        if (response?.error) {
            ErrorUtils.getAndPrintErrors(response);
            Validators.exitWithError(this);
        } else {
            Logger.success(`Successfully added key "${args.name}".`);
        }
    }
}
