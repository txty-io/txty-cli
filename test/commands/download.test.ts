import { test } from "@oclif/test";
import { cleanDatabase, loadCLISeeds } from "../TestUtils";

describe("download", () => {
    before(async () => {
        await cleanDatabase();
        await loadCLISeeds();
    });

    test.command(["download", "invalid"]).exit(2).it("fails with arg");

    test.command(["download"]).it("downloads translations");
});
