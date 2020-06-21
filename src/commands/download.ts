import { Command, flags } from "@oclif/command";
import { ProjectsAPI } from "../api/ProjectsAPI";
import { Settings } from "../settings";
import * as path from "path";
import fs from "fs";
import AdmZip from "adm-zip";

export default class Download extends Command {
    static description = "download the translations";

    static flags = {
        help: flags.help({ char: "h" })
    };

    static args = [];

    static examples = [`$ texterify download`];

    async run() {
        this.parse(Download);

        const projectId = Settings.getProjectID();
        if (!projectId) {
            this.error("No project ID set.");
        }

        const exportConfigId = Settings.getExportConfigID();
        if (!exportConfigId) {
            this.error("No export config ID set.");
        }

        console.log("Downloading translations...");
        let response;
        try {
            response = await ProjectsAPI.export(projectId, exportConfigId);
        } catch (error) {
            console.error(error);
            this.error("Failed to download translations.");
        }
        console.log("Translations downloaded.");

        const zipName = path.join(Settings.getProjectPath(), `.texterify-${projectId}.zip`);

        const dest = fs.createWriteStream(zipName);
        response.body.pipe(dest);
        response.body.on("error", (err: any) => {
            this.error("Error while downloading", err);
        });
        dest.on("finish", () => {
            // console.log(".zip file downloaded.");
            console.log(`Extracting translations to "${Settings.getExportDirectory()}".`);

            const zip = new AdmZip(zipName);
            zip.extractAllTo(Settings.getExportDirectory(), true);
            fs.unlinkSync(zipName);

            console.log(`Translations extracted.`);
        });
        dest.on("error", (err: any) => {
            console.error("Error while downloading", err);
        });
    }
}
