import { exit } from "process";
import { Logger } from "../Logger";
import { Validators } from "../Validators";
import { API } from "./API";
import { TranslationsAPI } from "./TranslationsAPI";

const KeysAPI = {
    getKeys: async (projectId: string) => {
        return API.getRequest(`projects/${projectId}/keys`);
    },

    createKey: async (options: {
        projectId: string;
        name: string;
        defaultLanguageTranslation?: string;
        description: string;
    }) => {
        const newKey = await API.postRequest(`projects/${options.projectId}/keys`, {
            name: options.name,
            description: options.description
        });

        if (newKey.data && options.defaultLanguageTranslation) {
            const newTranslationResponse = await TranslationsAPI.createTranslation({
                content: options.defaultLanguageTranslation,
                keyId: newKey.data.attributes.id,
                projectId: options.projectId
            });

            if (newTranslationResponse.error === "NO_DEFAULT_LANGUAGE_SPECIFIED") {
                Logger.error("You need to define a default language if you want to add translations directly.");
            }
        }

        return newKey;
    },

    update: async (projectId: string, keyId: string, name: string, description: string) => {
        return API.putRequest(`projects/${projectId}/keys/${keyId}`, {
            name: name,
            description: description
        });
    },

    deleteKeys: async (projectId: string, keys: any) => {
        return API.deleteRequest(`projects/${projectId}/keys`, {
            keys: keys
        });
    }
};

export { KeysAPI };
