import { API } from "./API";

const KeysAPI = {
    getKeys: async (projectId: string): Promise<any> => {
        return API.getRequest(`projects/${projectId}/keys`);
    },

    createKey: async (projectId: string, name: string, description: string): Promise<any> => {
        return API.postRequest(`projects/${projectId}/keys`, {
            name: name,
            description: description
        });
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
