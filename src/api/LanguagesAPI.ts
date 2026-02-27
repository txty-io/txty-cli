import { API } from "./API";

export interface ILanguageCode {
    id: string;
    type: "language_code";
    attributes: {
        id: string;
        name: string;
        code: string;
    };
}

export interface ILanguage {
    id: string;
    type: "language";
    attributes: {
        id: string;
        name: string;
        is_default: boolean;
    };
    relationships: {
        language_code: {
            data: { id: string; type: "language_code" } | null;
        };
    };
}

export interface IGetLanguagesResponse {
    data: ILanguage[];
    included: ILanguageCode[];
    meta: { total: number };
}

const LanguagesAPI = {
    getLanguages: async (projectId: string): Promise<IGetLanguagesResponse> => {
        return API.getRequest(`projects/${projectId}/languages`, { show_all: true });
    }
};

export { LanguagesAPI };
