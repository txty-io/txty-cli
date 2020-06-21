import { API } from "./API";

const TranslationsAPI = {
    createTranslation: async (projectId: string, languageId: string, keyId: string, content: string) => {
        return API.postRequest(`projects/${projectId}/translations`, true, {
            language_id: languageId,
            key_id: keyId,
            translation: {
                content: content
            }
        });
    }
};

export { TranslationsAPI };
