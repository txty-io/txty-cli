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
import { ErrorUtils } from "../api/ErrorUtils";
import { Command, Flags } from "@oclif/core";
import { auth_email_flag } from "../flags/auth_email_flag";
import { auth_secret_flag } from "../flags/auth_secret_flag";
import { help_flag } from "../flags/help_flag";

export default class Download extends Command {
    static description = "download the translations";

    static flags = {
        help: help_flag,
        "project-path": Flags.string(),
        emojify: Flags.boolean(),
        "auth-email": auth_email_flag,
        "auth-secret": auth_secret_flag
    };

    static args = [];

    static examples = ["$ texterify download"];

    async run() {
        const { flags } = await this.parse(Download);
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

        const exportConfigId = Settings.getExportConfigID();
        Validators.ensureExportConfigId(exportConfigId);

        const tasks = new Listr([
            {
                title: "Downloading translations...",
                task: async (ctx) => {
                    try {
                        let response: any = await ProjectsAPI.export(projectId, exportConfigId, {
                            emojify: flags.emojify
                        });

                        if (response.status !== 200) {
                            response = await response.json();
                            if (response?.error) {
                                ErrorUtils.getAndPrintErrors(response);
                                throw new Error(response);
                            }

                            Logger.error("Failed to download translations.");

                            throw new Error(response);
                        } else {
                            ctx.exportResponse = response;
                        }
                    } catch (error) {
                        Logger.error("Failed to download translations.");
                        showErrorFixSuggestions(error);
                        throw new Error();
                    }
                }
            },
            {
                title: "Extracting translations...",
                task: async (ctx, task) => {
                    const zipName = path.join(Settings.getProjectPath(), `.texterify-${projectId}.zip`);

                    const dest = fs.createWriteStream(zipName);
                    ctx.exportResponse.body.pipe(dest);

                    const promise = new Promise<void>((resolve, reject) => {
                        dest.on("finish", () => {
                            task.output = `Extracting translations to "${Settings.getExportDirectory()}".`;

                            try {
                                const zip = new AdmZip(zipName);
                                zip.extractAllTo(Settings.getExportDirectory(), true);
                            } catch (error) {
                                Logger.error("Failed to extract translations.");
                                reject(error);
                            }
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
            Logger.error("Failed to download and extract translations.");
            showErrorFixSuggestions(error);
            Validators.exitWithError(this);
        }
    }
}
