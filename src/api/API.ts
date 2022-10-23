import fetch from "node-fetch";
import * as queryString from "query-string";
import { globalConfig, projectConfig } from "../Config";
import { Logger } from "../Logger";
import { Settings } from "../Settings";
import { Validators } from "../Validators";

const DEFAULT_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json"
};

async function request(url: string, method: string, headers: any, params: any, isFileDownload: boolean | undefined) {
    try {
        // tslint:disable-next-line:no-parameter-reassignment
        params = params || {};

        const requestHeaders = { ...DEFAULT_HEADERS, ...headers };

        const apiBaseUrl = Settings.getAPIBaseURL();
        Validators.ensureAPIBaseUrl(apiBaseUrl);

        const apiVersion = Settings.getAPIVersion();
        Validators.ensureAPIVersion(apiVersion);

        let fullURL = `${apiBaseUrl}/${apiVersion}/${url}`;

        const authEmail = Settings.getAuthEmail();
        requestHeaders["Auth-Email"] = authEmail;
        Validators.ensureAuthEmail(authEmail);

        const authSecret = Settings.getAuthSecret();
        requestHeaders["Auth-Secret"] = authSecret;
        Validators.ensureAuthSecret(authSecret);

        // Add query params if it is a get request.
        if (method === "GET" && params) {
            fullURL += `?${queryString.stringify(params)}`;
        }

        const options: any = {
            method: method,
            headers: requestHeaders
        };

        if (method !== "GET") {
            options.body = JSON.stringify(params);
        }

        let response;
        try {
            response = await fetch(fullURL, options);
            if (response.status !== 200 && response.status !== 400) {
                if (response.status === 404) {
                    Logger.error(
                        "The resource could not be found. Maybe your auth credentials are wrong or you don't have the permission to access this resource."
                    );
                } else {
                    Logger.error(`Invalid response status received: ${response.status}`);
                }

                throw await response.json();
            }
        } catch (error) {
            throw error;
        }

        return response && !isFileDownload ? response.json() : response;
    } catch (error) {
        Logger.error(error);
        throw error;
    }
}

const API = {
    getRequest: async (url: string, queryParams?: any, headers?: any, isFileDownload?: boolean) => {
        return request(url, "GET", headers, queryParams, isFileDownload);
    },

    postRequest: async (url: string, body?: any, headers?: any) => {
        return request(url, "POST", headers, body, false);
    },

    putRequest: async (url: string, body?: any, headers?: any) => {
        return request(url, "PUT", headers, body, false);
    },

    deleteRequest: async (url: string, body?: any, headers?: any) => {
        return request(url, "DELETE", headers, body, false);
    }
};

export { API };
