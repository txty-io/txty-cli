import AdmZip from "adm-zip";
import fs from "fs";
import * as path from "path";
import { ProjectsAPI } from "../api/ProjectsAPI";
import { Settings } from "../settings";

async function download(projectId: string) {
    const response = await ProjectsAPI.export(projectId);
    const zipName = path.join(Settings.getProjectPath(), `.texterify-${projectId}.zip`);

    console.log("Saving .zip to", zipName);

    const dest = fs.createWriteStream(zipName);
    response.body.pipe(dest);
    response.body.on("error", (err: any) => {
        console.error("Error while downloading", err);
    });
    dest.on("finish", () => {
        console.log(".zip file downloaded.");
        console.log("Extracting files to", Settings.getExportDirectory());

        const zip = new AdmZip(zipName);
        zip.extractAllTo(Settings.getExportDirectory(), true);
        fs.unlinkSync(zipName);
    });
    dest.on("error", (err: any) => {
        console.error("Error while downloading", err);
    });
}

export { download };
