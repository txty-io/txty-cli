import { successColor, warningColor, errorColor, infoColor } from "./colors";

export const Logger = {
    log: (...args: any[]) => {
        console.log(...args);
    },

    info: (...args: any[]) => {
        console.log(infoColor(...args));
    },

    success: (...args: any[]) => {
        console.log(successColor(...args));
    },

    warn: (...args: any[]) => {
        console.warn(warningColor(...args));
    },

    error: (...args: any[]) => {
        console.error(errorColor(...args));
    },

    printSeparator: () => {
        Logger.info("\n---\n");
    },

    printErrorSeparator: () => {
        Logger.info("\n[ERROR]");
    }
};
