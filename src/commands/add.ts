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

    static strict = false;

    static flags = {
        help: help_flag,
        "project-path": Flags.string(),
        description: Flags.string({ description: "Description of the key." }),
        "auth-email": auth_email_flag,
        "auth-secret": auth_secret_flag
    };

    static args = [{ name: "name", required: true }];

    static examples = [
        '$ texterify add "app.title" "MyApp" --description "The name of the app."',
        '$ texterify add "app.description" "My app description"',
        '$ texterify add "app.title" en="MyApp" de="MeineApp"',
        '$ texterify add "app.title" en="MyApp" de="MeineApp" --description "The app name"'
    ];

    async run() {
        const { args, flags, argv } = await this.parse(Add);
        Settings.setAuthCredentialsPassedViaCLI({
            email: flags["auth-email"],
            secret: flags["auth-secret"]
        });

        if (flags["project-path"]) {
            const configFilePath = path.join(flags["project-path"], "texterify.json");
            const newProjectStore = new nconf.Provider();
            newProjectStore.file({ file: configFilePath });
            projectConfig.setStore(newProjectStore);
            projectConfig.setKey("project_path", flags["project-path"]);
        }

        const projectId = Settings.getProjectID();
        Validators.ensureProjectId(projectId);

        // Parse remaining positional args: "lang=content" pairs or plain default content
        const langTranslations: { [langCode: string]: string } = {};
        let defaultContent: string | undefined;

        // Filter out the declared key name arg and any flag-like tokens from argv
        const extraArgs = (argv as string[]).filter(
            (tok) => tok !== args.name && !tok.startsWith("-")
        );

        for (const arg of extraArgs) {
            const eqIndex = arg.indexOf("=");
            if (eqIndex > 0) {
                const langCode = arg.substring(0, eqIndex);
                const content = arg.substring(eqIndex + 1);
                langTranslations[langCode] = content;
            } else {
                defaultContent = arg;
            }
        }

        if (defaultContent && Object.keys(langTranslations).length > 0) {
            Logger.warn(
                "Both a default translation and language-specific translations were provided. " +
                "The default translation will target the project's default language."
            );
        }

        let response: any;
        try {
            response = await KeysAPI.createKey({
                projectId: projectId,
                name: args.name,
                description: flags.description || "",
                defaultLanguageTranslation: defaultContent,
                langTranslations: Object.keys(langTranslations).length > 0 ? langTranslations : undefined
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
