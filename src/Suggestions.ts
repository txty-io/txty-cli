import { Logger } from "./Logger";

export function showErrorFixSuggestions(error: any) {
    if (error.name === "FetchError") {
        if (error.type === "invalid-json") {
            Logger.error("The API didn't return valid JSON.");
            Logger.error("Check if the API URL is valid and that the server is reachable.");
        }
    }
    Logger.printErrorSeparator();
    if (error.message) {
        Logger.error(error.message);
    } else {
        Logger.error(error);
    }
}
