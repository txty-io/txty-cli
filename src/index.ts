#!/usr/bin/env node

import program from "commander";
import packageJson from "../package.json";
import { add } from "./commands/add";
import { download } from "./commands/download";
import { handleProgramOptions } from "./Config";
import { Settings } from "./Settings";

program.version(packageJson.version);
program.option("--project-path <path>", "the path of the project folder");

program
    .command("add <key> [description]")
    .action(async function (key: string, description: string) {
        handleProgramOptions(program);

        const projectId = Settings.getProjectID();

        if (projectId) {
            process.exitCode = await add(projectId, key, description);
        } else {
            console.error("No project ID set.");
            process.exitCode = -1;
        }
    });

program
    .command("download")
    .action(async function () {
        handleProgramOptions(program);

        const projectId = Settings.getProjectID();

        return download(projectId);
    });

program
    .command("*")
    .action(function (env: any) {
        console.error("Unknow command. Use -h for a list of commands.");
    });

program.parse(process.argv);
