import { Command, Flags } from "@oclif/core";
import * as fs from "fs";
import open from "open";
import { handleProjectPathFlag, project_path_flag } from "../flags/project_path_flag";
import { Settings } from "../Settings";
import { Validators } from "../Validators";

export default class Open extends Command {
    static description = "open txty website for the current project";

    static flags = {
        help: Flags.help({ char: "h" }),
        "project-path": project_path_flag
    };
    static examples = ["$ txty open"];

    async run() {
        const { flags } = await this.parse(Open);
        handleProjectPathFlag(flags["project-path"]);

        const projectId = Settings.getProjectID();
        Validators.ensureProjectId(projectId);

        const apiBaseUrl = Settings.getAPIBaseURL();
        Validators.ensureAPIBaseUrl(apiBaseUrl);

        const base = apiBaseUrl.split("/api")[0];
        const route = "/dashboard/projects/";
        const url = `${base}${route}${projectId}`;
        await open(url);
    }
}
