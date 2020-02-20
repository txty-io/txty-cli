import { Settings } from "../settings";
import { API } from "./API";

function getBase64(file: any) {
  return Buffer.from(file, "base64");
}

const ProjectsAPI = {
  getProjects: async (): Promise<any> => {
    return API.getRequest("projects");
  },

  getProject: async (projectId: string): Promise<any> => {
    return API.getRequest(`projects/${projectId}`);
  },

  createProject: async (name: string, description: string): Promise<any> => {
    return API.postRequest(`projects`, {
      project: {
        name: name,
        description: description
      }
    });
  },

  updateProject: async (name: string, description: string): Promise<any> => {
    return API.putRequest(`projects`, {
      project: {
        name: name,
        description: description
      }
    });
  },

  export: (projectId: string) => {
    return API.getRequest(
      `projects/${projectId}/exports/${Settings.getExportConfigID()}`,
      null,
      null,
      true
    );
  },

  import: async (projectId: string, languageId: string, file: any) => {
    const fileBase64 = await getBase64(file);

    return API.postRequest(`projects/${projectId}/import`, {
      language_id: languageId,
      file: fileBase64
    });
  }
};

export { ProjectsAPI };
