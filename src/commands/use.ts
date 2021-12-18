import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Logger } from "../Logger";
import { Validators } from "../Validators";

// nvm like support for multiple texterify servers by allowing you to switch between
// multiple global configs named e.g. ~/.texterify.json.serverA and ~/.texterify.json.serverB
// by calling "texterify use serverA" or "texterify use serverB".
export default class Use extends Command {
    static description =
        "Switch to a different texterify server (e.g. if different projects use different servers). " +
        "Different global configs should be stored in ~/.texterify.json.{global_config_name}";

    static flags = {
        help: flags.help({ char: "h" })
    };

    static args = [{ name: "global_config_name", required: true }];

    static examples = ["$ texterify use serverA", "$ texterify use serverB"];

    async run() {
        const { args } = this.parse(Use);

        // Create total path to new global config
        const configName = path.join(os.homedir(), ".texterify.json." + args.global_config_name);

        Validators.ensureFileExists(configName, "Global config not found:");

        // Copy to current global config
        fs.copyFile(configName, path.join(os.homedir(), ".texterify.json"), (err) => {
            if (err) {
                Logger.error("Failed to copy config file.");
                Validators.exitWithError();
            } else {
                Logger.success(`\nSwitched to texterify server "${args.global_config_name}".`);
            }
        });
    }
}
