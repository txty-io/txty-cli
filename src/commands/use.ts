import { Args, Command, Flags } from "@oclif/core";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Logger } from "../Logger";
import { Validators } from "../Validators";

// nvm like support for multiple txty servers by allowing you to switch between
// multiple global configs named e.g. ~/.txty.json.serverA and ~/.txty.json.serverB
// by calling "txty use serverA" or "txty use serverB".
export default class Use extends Command {
    static description =
        "switch to a different txty server (e.g. if different projects use different servers), " +
        "different global configs should be stored in ~/.txty.json.{global_config_name}";

    static flags = {
        help: Flags.help({ char: "h" })
    };

    static args = { global_config_name: Args.string({ required: true }) };

    static examples = ["$ txty use serverA", "$ txty use serverB"];

    async run() {
        const { args } = await this.parse(Use);

        // Create total path to new global config
        const configName = path.join(os.homedir(), ".txty.json." + args.global_config_name);

        Validators.ensureFileExists(configName, "Global config not found:");

        // Copy to current global config
        fs.copyFile(configName, path.join(os.homedir(), ".txty.json"), (err) => {
            if (err) {
                Logger.error("Failed to copy config file.");
                Validators.exitWithError(this);
            } else {
                Logger.success(`\nSwitched to txty server "${args.global_config_name}".`);
            }
        });
    }
}
