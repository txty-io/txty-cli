import { exit } from "process";
import { Logger } from "../Logger";
import { Validators } from "../Validators";
import { API } from "./API";
import { LanguagesAPI, IGetLanguagesResponse } from "./LanguagesAPI";
import { TranslationsAPI } from "./TranslationsAPI";

function buildLangCodeToIdMap(response: IGetLanguagesResponse): Map<string, string> {
    const map = new Map<string, string>();
    const included = response.included || [];

    for (const lang of response.data || []) {
        const langCodeRef = lang.relationships?.language_code?.data;
        if (langCodeRef) {
            const langCodeObj = included.find(
                (inc) => inc.id === langCodeRef.id && inc.type === "language_code"
            );
            if (langCodeObj) {
                map.set(langCodeObj.attributes.code, lang.id);
            }
        }
    }

    return map;
}

const KeysAPI = {
    getKeys: async (projectId: string) => {
        return API.getRequest(`projects/${projectId}/keys`);
    },

    createKey: async (options: {
        projectId: string;
        name: string;
        defaultLanguageTranslation?: string;
        description: string;
        langTranslations?: { [langCode: string]: string };
    }) => {
        const newKey: any = await API.postRequest(`projects/${options.projectId}/keys`, {
            name: options.name,
            description: options.description
        });

        if (newKey.error) {
            return newKey;
        }

        const keyId = newKey.data.attributes.id;

        // Existing behavior: default language translation (no explicit language ID)
        if (options.defaultLanguageTranslation) {
            const newTranslationResponse: any = await TranslationsAPI.createTranslation({
                content: options.defaultLanguageTranslation,
                keyId: keyId,
                projectId: options.projectId
            });

            if (newTranslationResponse.error === "NO_DEFAULT_LANGUAGE_SPECIFIED") {
                Logger.error(
                    "You need to define a default language if you want to add translations for your default language directly when creating a new key."
                );
            }
        }

        // New behavior: explicit language-code translations
        if (options.langTranslations && Object.keys(options.langTranslations).length > 0) {
            try {
                const languagesResponse: IGetLanguagesResponse = await LanguagesAPI.getLanguages(options.projectId);
                const langCodeToId = buildLangCodeToIdMap(languagesResponse);

                for (const [langCode, content] of Object.entries(options.langTranslations)) {
                    const languageId = langCodeToId.get(langCode);
                    if (!languageId) {
                        Logger.warn(`Language code "${langCode}" not found in project. Skipping.`);
                        continue;
                    }

                    const translationResponse: any = await TranslationsAPI.createTranslation({
                        content,
                        keyId,
                        languageId,
                        projectId: options.projectId
                    });

                    if (translationResponse.error) {
                        Logger.warn(`Failed to create translation for language "${langCode}".`);
                    } else {
                        Logger.success(`Translation for "${langCode}" added.`);
                    }
                }
            } catch (e) {
                Logger.warn("Failed to fetch project languages. Skipping language-specific translations.");
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
