import { API } from "./API";

const TranslationsAPI = {
    createTranslation: async (options: { projectId: string; languageId?: string; keyId: string; content: string }) => {
        return API.postRequest(`projects/${options.projectId}/translations`, {
            language_id: options.languageId,
            key_id: options.keyId,
            translation: {
                content: options.content
            }
        });
    }
};

export { TranslationsAPI };
