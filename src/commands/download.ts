import { Command, Flags } from "@oclif/core";
import AdmZip from "adm-zip";
import fs from "fs";
import Listr from "listr";
import * as path from "path";
import { ErrorUtils } from "../api/ErrorUtils";
import { ProjectsAPI } from "../api/ProjectsAPI";
import { auth_email_flag } from "../flags/auth_email_flag";
import { auth_secret_flag } from "../flags/auth_secret_flag";
import { help_flag } from "../flags/help_flag";
import { handleProjectPathFlag, project_path_flag } from "../flags/project_path_flag";
import { Logger } from "../Logger";
import { Settings } from "../Settings";
import { showErrorFixSuggestions } from "../Suggestions";
import { Validators } from "../Validators";

export default class Download extends Command {
    static description = "download the translations";

    static flags = {
        help: help_flag,
        "project-path": project_path_flag,
        "export-config-id": Flags.string(),
        emojify: Flags.boolean(),
        "auth-email": auth_email_flag,
        "auth-secret": auth_secret_flag
    };

    static args = {};

    static examples = ["$ txty download"];

    async run() {
        const { flags } = await this.parse(Download);
        Settings.setAuthCredentialsPassedViaCLI({
            email: flags["auth-email"],
            secret: flags["auth-secret"]
        });

        handleProjectPathFlag(flags["project-path"]);

        const projectId = Settings.getProjectID();
        Validators.ensureProjectId(projectId);

        const exportConfigId = flags["export-config-id"] || Settings.getExportConfigID();
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
                    const zipName = path.join(Settings.getProjectPath(), `.txty-${projectId}.zip`);

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
