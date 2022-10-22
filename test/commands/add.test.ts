import { test } from "@oclif/test";
import * as uuid from "uuid";
import { cleanDatabase, loadCLISeeds } from "../TestUtils";

describe("add", () => {
    before(async () => {
        await cleanDatabase();
        await loadCLISeeds();
    });

    test.command(["add"]).exit(2).it("fails without key name");

    test.command(["add", `app.title-${uuid.v4()}`]).it("succeeds with key name");

    test.command(["add", `app.title-${uuid.v4()}`, "MyApp"]).it("succeeds with key name and translation");

    test.command(["add", `app.title-${uuid.v4()}`, "MyApp", "--description", "The name of the app."]).it(
        "succeeds with key name, translation and description"
    );
});
