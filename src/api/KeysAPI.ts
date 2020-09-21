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

        if (options.defaultLanguageTranslation) {
            await TranslationsAPI.createTranslation({
                content: options.defaultLanguageTranslation,
                keyId: newKey.data.attributes.id,
                projectId: options.projectId
            });
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
