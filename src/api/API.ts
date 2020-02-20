import fetch from "node-fetch";
import * as queryString from "query-string";
import { globalConfig, projectConfig } from "../config";
import { Settings } from "../settings";

const LOGGING_PREFIX: string = "[API]";

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

async function request(
  url: string,
  method: string,
  headers: any,
  params: any,
  isFileDownload: boolean | undefined
): Promise<any> {
  console.log(LOGGING_PREFIX, "Sending request to:", url);
  try {
    // tslint:disable-next-line:no-parameter-reassignment
    params = params || {};

    const requestHeaders: any = { ...DEFAULT_HEADERS, ...headers };

    let fullURL: string = `${Settings.getAPIBaseURL()}/${Settings.getAPIVersion()}/${url}`;

    params.email = globalConfig.getKey("auth_email");
    params.api_secret = globalConfig.getKey("auth_secret");

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

    let response: any;
    try {
      response = await fetch(fullURL, options);
    } catch (error) {
      console.error("Error while fetching:", error);
    }

    console.log(LOGGING_PREFIX, "Finished request to:", url);

    return response && !isFileDownload ? response.json() : response;
  } catch (err) {
    console.error(err);
  }
}

const API = {
  getRequest: (url: string, queryParams?: any, headers?: any, isFileDownload?: boolean): any => {
    return request(url, "GET", headers, queryParams, isFileDownload);
  },

  postRequest: (url: string, body?: any, headers?: any): any => {
    return request(url, "POST", headers, body, false);
  },

  putRequest: (url: string, body?: any, headers?: any): any => {
    return request(url, "PUT", headers, body, false);
  },

  deleteRequest: (url: string, body?: any, headers?: any): any => {
    return request(url, "DELETE", headers, body, false);
  }
};

export { API };
