import { Logger } from "../Logger";

export const ERROR_MESSAGES = {
    invalid: "{name} is invalid.",
    taken: "{name} is already in use.",
    not_found: "{name} could not be found.",
    blank: "{name} cannot be blank."
};

type ERRORS_MESSAGE_IDS = keyof typeof ERROR_MESSAGES;

export const ERRORS: { [key: string]: ERRORS_MESSAGE_IDS } = {
    INVALID: "invalid",
    TAKEN: "taken",
    NOT_FOUND: "not_found",
    BLANK: "blank"
};

export type IError =
    | {
          error: ERRORS_MESSAGE_IDS;
      }
    | ERRORS_MESSAGE_IDS;

export interface IErrors {
    [field: string]: IError[] | IError;
}

export interface IErrorsResponse {
    error: boolean;
    message: string;
    details: IErrors;
    errors: IErrors;
}

export const ErrorUtils = {
    getErrors(errors: IErrors) {
        const keys = Object.keys(errors);
        const errorMessages: string[] = [];

        keys.forEach((key) => {
            if (errors[key] instanceof Array) {
                (errors[key] as IErrors[]).forEach((error) => {
                    if (typeof error === "object") {
                        errorMessages.push(
                            this.getErrorMessage(
                                key,
                                (error as {
                                    error: ERRORS_MESSAGE_IDS;
                                }).error
                            )
                        );
                    } else {
                        errorMessages.push(this.getErrorMessage(key, error));
                    }
                });
            } else if (typeof errors[key] === "string") {
                errorMessages.push(this.getErrorMessage(key, errors[key] as ERRORS_MESSAGE_IDS));
            }
        });

        return errorMessages;
    },

    getAndPrintErrors(errorResponse: IErrorsResponse) {
        if (errorResponse.message) {
            Logger.error(errorResponse.message);
        }

        if (errorResponse.details || errorResponse.errors) {
            if (typeof errorResponse.details === "object" || typeof errorResponse.errors === "object") {
                const errorMessages = ErrorUtils.getErrors(errorResponse.details || errorResponse.errors);
                errorMessages.forEach((error) => {
                    Logger.error(error);
                });
            } else {
                Logger.error(errorResponse.details);
            }
        }
    },

    getErrorMessage(name: string, error: ERRORS_MESSAGE_IDS) {
        return ERROR_MESSAGES[error].replace("{name}", name.charAt(0).toUpperCase() + name.slice(1));
    }
};
