import { Command, Flags } from "@oclif/core";
import * as fs from "fs";
import open from "open";
import { Validators } from "../Validators";

export default class Open extends Command {
    static description = "open texterify website for the current project";

    static flags = {
        help: Flags.help({ char: "h" })
    };
    static examples = ["$ texterify open"];

    async run() {
        const CONFIG_NAME = "texterify.json";
        Validators.ensureFileExists(CONFIG_NAME, "Project config not found:");

        const f = fs.readFileSync(CONFIG_NAME, "utf8");
        const config = JSON.parse(f);

        const base = config.api_base_url.split("/api")[0];
        const route = "/dashboard/projects/";
        const url = `${base}${route}${config.project_id}`;
        await open(url);
    }
}
