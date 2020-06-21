import { Command, flags } from "@oclif/command";
import AdmZip from "adm-zip";
import fs from "fs";
import Listr from "listr";
import * as path from "path";
import { ProjectsAPI } from "../api/ProjectsAPI";
import { Logger } from "../Logger";
import { Settings } from "../Settings";
import { Validators } from "../Validators";
import { showErrorFixSuggestions } from "../Suggestions";
import { projectConfig } from "../Config";
import * as nconf from "nconf";

export default class Download extends Command {
    static description = "download the translations";

    static flags = {
        help: flags.help({ char: "h" }),
        "project-path": flags.string()
    };

    static args = [];

    static examples = ["$ texterify download"];

    async run() {
        const { flags } = this.parse(Download);

        if (flags["project-path"]) {
            const configFilePath = path.join(flags["project-path"], "texterify.json");
            const newProjectStore = new nconf.Provider();
            newProjectStore.file({ file: configFilePath });
            projectConfig.setStore(newProjectStore);
            projectConfig.setKey("project_path", flags["project-path"]);
        }

        const projectId = Settings.getProjectID();
        Validators.ensureProjectId(projectId);

        const exportConfigId = Settings.getExportConfigID();
        Validators.ensureExportConfigId(exportConfigId);

        const tasks = new Listr([
            {
                title: "Downloading translations...",
                task: async (ctx) => {
                    try {
                        const response = await ProjectsAPI.export(projectId, exportConfigId);

                        ctx.exportResponse = response;
                    } catch (error) {
                        Logger.error("Failed to download translations.");
                        showErrorFixSuggestions(error);
                        Validators.exitWithError();
                    }
                }
            },
            {
                title: "Extracting translations...",
                task: async (ctx, task) => {
                    const zipName = path.join(Settings.getProjectPath(), `.texterify-${projectId}.zip`);

                    const dest = fs.createWriteStream(zipName);
                    ctx.exportResponse.body.pipe(dest);

                    const promise = new Promise((resolve, reject) => {
                        dest.on("finish", () => {
                            task.output = `Extracting translations to "${Settings.getExportDirectory()}".`;

                            const zip = new AdmZip(zipName);
                            zip.extractAllTo(Settings.getExportDirectory(), true);
                            fs.unlinkSync(zipName);

                            resolve();
                        });
                        dest.on("error", (error) => {
                            Logger.error("Failed to extract translations.");
                            showErrorFixSuggestions(error);
                            reject();
                        });
                    });

                    return promise;
                }
            }
        ]);

        try {
            await tasks.run();
            Logger.success("\nSuccessfully downloaded and extracted translations.");
        } catch (error) {
            Logger.error("Failed to download translations.");
            showErrorFixSuggestions(error);
            Validators.exitWithError();
        }
    }
}
