import { Args, Command, Flags } from "@oclif/core";
import { ErrorUtils } from "../api/ErrorUtils";
import { KeysAPI } from "../api/KeysAPI";
import { auth_email_flag } from "../flags/auth_email_flag";
import { auth_secret_flag } from "../flags/auth_secret_flag";
import { help_flag } from "../flags/help_flag";
import { handleProjectPathFlag, project_path_flag } from "../flags/project_path_flag";
import { Logger } from "../Logger";
import { Settings } from "../Settings";
import { showErrorFixSuggestions } from "../Suggestions";
import { Validators } from "../Validators";

export default class Add extends Command {
    static description = "Add a new key with an optional default language translation content.";

    static flags = {
        help: help_flag,
        "project-path": project_path_flag,
        description: Flags.string({ description: "Description of the key." }),
        "auth-email": auth_email_flag,
        "auth-secret": auth_secret_flag
    };

    static args = {
        name: Args.string({ required: true }),
        content: Args.string({})
    };

    static examples = [
        '$ txty add "app.title" "MyApp" --description "The name of the app."',
        '$ txty add "app.description" "My app description"'
    ];

    async run() {
        const { args, flags } = await this.parse(Add);
        Settings.setAuthCredentialsPassedViaCLI({
            email: flags["auth-email"],
            secret: flags["auth-secret"]
        });

        handleProjectPathFlag(flags["project-path"]);

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
