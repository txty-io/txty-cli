import { test } from "@oclif/test";
import * as uuid from "uuid";
import { executeCypressCommand } from "../TestUtils";

describe("add", () => {
    before(async () => {
        await executeCypressCommand({ command: "clean" });
        await executeCypressCommand({ command: "load_seed_cli" });
    });

    test.command(["add"]).exit(2).it("fails without key name");

    test.command(["add", `app.title-${uuid.v4()}`]).it("succeeds with key name");

    test.command(["add", `app.title-${uuid.v4()}`, "MyApp"]).it("succeeds with key name and translation");

    test.command(["add", `app.title-${uuid.v4()}`, "MyApp", "--description", "The name of the app."]).it(
        "succeeds with key name, translation and description"
    );

    test.command(["add", `app.title-${uuid.v4()}`, "en=MyApp"]).it("succeeds with single lang=content arg");

    test.command(["add", `app.title-${uuid.v4()}`, "en=MyApp", "de=MeineApp"]).it(
        "succeeds with multiple lang=content args"
    );

    test.command(["add", `app.title-${uuid.v4()}`, "en=MyApp", "de=MeineApp", "--description", "The app name."]).it(
        "succeeds with multiple lang=content args and description"
    );

    test.command(["add", `app.title-${uuid.v4()}`, "unknown_lang=Hello"]).it(
        "succeeds but warns when lang code is not found in project"
    );

    // Backward compat: existing plain content arg still works
    test.command(["add", `app.title-${uuid.v4()}`, "MyApp"]).it("still succeeds with plain content (backward compat)");
});
