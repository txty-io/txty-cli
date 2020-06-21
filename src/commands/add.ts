import { Command, flags } from "@oclif/command";
import { Settings } from "../Settings";
import { KeysAPI } from "../api/KeysAPI";
import { ErrorUtils } from "../api/ErrorUtils";

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
        if (!projectId) {
            this.error("No project ID set.");
        }

        let response;
        try {
            response = await KeysAPI.createKey(projectId, args.name, args.description || "");

            if (response?.errors) {
                console.error(ErrorUtils.showErrors(response.errors));
                this.exit(1);
            }

            this.log(`Key "${args.name}" successfully added.`);
        } catch (error) {
            console.error(error);
            this.error("Failed to add key.");
        }
    }
}
