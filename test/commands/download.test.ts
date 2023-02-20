import { test } from "@oclif/test";
import { executeCypressCommand } from "../TestUtils";

describe("download", () => {
    before(async () => {
        await executeCypressCommand({ command: "clean" });
        await executeCypressCommand({ command: "load_seed_cli" });
    });

    test.command(["download", "invalid"]).exit(2).it("fails with arg");

    test.command(["download"]).it("downloads translations");
});
