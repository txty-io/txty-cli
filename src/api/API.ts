import fetch from "node-fetch";
import * as queryString from "query-string";
import { globalConfig } from "../Config";
import { Settings } from "../Settings";
import { CLIError } from "@oclif/errors";

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
        if (!apiBaseUrl) {
            throw new CLIError("Please specify the API base url in your local .texterify.json config (api_base_url)");
        }

        const apiVersion = Settings.getAPIVersion();
        if (!apiVersion) {
            throw new CLIError("Please specify the API version in your local .texterify.json config (api_version)");
        }

        let fullURL = `${apiBaseUrl}/${apiVersion}/${url}`;

        params.email = globalConfig.getKey("auth_email");
        if (!params.email) {
            throw new CLIError("Please specify the auth email in ~/.texterify.json (auth_email)");
        }

        params.api_secret = globalConfig.getKey("auth_secret");
        if (!params.email) {
            throw new CLIError("Please specify the auth secret ~/.texterify.json (auth_secret)");
        }

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
        } catch (error) {
            console.error("Error while fetching:", error);
            throw error;
        }

        return response && !isFileDownload ? response.json() : response;
    } catch (error) {
        console.error(error);
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
