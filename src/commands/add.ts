import { Command, flags } from "@oclif/command";
import { ErrorUtils } from "../api/ErrorUtils";
import { KeysAPI } from "../api/KeysAPI";
import { Logger } from "../Logger";
import { Settings } from "../Settings";
import { Validators } from "../Validators";
import { showErrorFixSuggestions } from "../Suggestions";

export default class Add extends Command {
    static description = "add a new key";

    static flags = {
        help: flags.help({ char: "h" })
    };

    static args = [{ name: "name", required: true }, { name: "description" }];

    static examples = ['$ texterify add app.title "The name of the app."', "$ texterify add app.description"];

    async run() {
        const { args } = this.parse(Add);

        const projectId = Settings.getProjectID();
        Validators.ensureProjectId(projectId);

        let response;
        try {
            response = await KeysAPI.createKey(projectId, args.name, args.description || "");
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
