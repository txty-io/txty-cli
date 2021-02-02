import { API } from "./API";

function getBase64(file: any) {
    return Buffer.from(file, "base64");
}

const ProjectsAPI = {
    getProjects: async () => {
        return API.getRequest("projects");
    },

    getProject: async (projectId: string) => {
        return API.getRequest(`projects/${projectId}`);
    },

    createProject: async (name: string, description: string) => {
        return API.postRequest("projects", {
            project: {
                name: name,
                description: description
            }
        });
    },

    updateProject: async (name: string, description: string) => {
        return API.putRequest("projects", {
            project: {
                name: name,
                description: description
            }
        });
    },

    export: (projectId: string, exportConfigId: string, options: { emojify: boolean }) => {
        return API.getRequest(`projects/${projectId}/exports/${exportConfigId}`, options, null, true);
    },

    import: async (projectId: string, languageId: string, file: any) => {
        const fileBase64 = getBase64(file);

        return API.postRequest(`projects/${projectId}/import`, {
            language_id: languageId,
            file: fileBase64
        });
    }
};

export { ProjectsAPI };
