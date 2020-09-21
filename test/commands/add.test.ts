import { test } from "@oclif/test";
import { TEST_DATA } from "../TestData";

describe("add", () => {
    test.command(["add"]).exit(2).it("fails without key name");

    test.nock(TEST_DATA.API_BASE_URL, (api) => {
        return api.post(`/v1/projects/${TEST_DATA.PROJECT_ID}/keys`).reply(200, TEST_DATA.KEY_RESPONSE);
    })
        .command(["add", "app.title"])
        .it("succeeds with key name");

    test.nock(TEST_DATA.API_BASE_URL, (api) => {
        return api.post(`/v1/projects/${TEST_DATA.PROJECT_ID}/keys`).reply(200, TEST_DATA.KEY_RESPONSE);
    })
        .nock(TEST_DATA.API_BASE_URL, (api) => {
            return api.post(`/v1/projects/${TEST_DATA.PROJECT_ID}/translations`).reply(200, {});
        })
        .command(["add", "app.title", "MyApp"])
        .it("succeeds with key name and translation");

    test.nock(TEST_DATA.API_BASE_URL, (api) => {
        return api.post(`/v1/projects/${TEST_DATA.PROJECT_ID}/keys`).reply(200, TEST_DATA.KEY_RESPONSE);
    })
        .nock(TEST_DATA.API_BASE_URL, (api) => {
            return api.post(`/v1/projects/${TEST_DATA.PROJECT_ID}/translations`).reply(200, {});
        })
        .command(["add", "app.title", "MyApp", "--description", "The name of the app."])
        .it("succeeds with key name, translation and description");
});
