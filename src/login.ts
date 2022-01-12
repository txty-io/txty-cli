import { Command, flags } from "@oclif/command";
import { ErrorUtils } from "./api/ErrorUtils";
import { KeysAPI } from "./api/KeysAPI";
import { Logger } from "./Logger";
import { Settings } from "./Settings";
import { Validators } from "./Validators";
import { showErrorFixSuggestions } from "./Suggestions";
import { globalConfig, projectConfig } from "./Config";
import * as nconf from "nconf";
import * as path from "path";
import { cli } from "cli-ux";

// export default class Add extends Command {
//     static description = "log in to a Texterify server";

//     static flags = {
//         help: flags.help({ char: "h" })
//     };

//     static examples = ["$ texterify login"];

//     async run() {
//         const { args, flags } = this.parse(Add);

//         const server = await cli.prompt("Which Texterify instance are you using?", {
//             default: "https://app.texterify.com"
//         });

//         const email = await cli.prompt("What is your email address?", { required: true });

//         const accessToken = await cli.prompt("Enter your access token?", {
//             required: true,
//             type: "hide"
//         });

//         // let response;
//         // try {
//         //     response = await KeysAPI.createKey({
//         //         projectId: projectId,
//         //         name: args.name,
//         //         description: flags.description || "",
//         //         defaultLanguageTranslation: args.content
//         //     });
//         // } catch (error) {
//         //     Logger.error("Failed to add key.");
//         //     showErrorFixSuggestions(error);
//         //     Validators.exitWithError();
//         // }

//         // globalConfig.setKey

//         // if (response?.errors) {
//         //     ErrorUtils.getAndPrintErrors(response.errors);
//         //     Validators.exitWithError();
//         // } else {
//         //     Logger.success(`Successfully added key "${args.name}".`);
//         // }
//     }
// }
