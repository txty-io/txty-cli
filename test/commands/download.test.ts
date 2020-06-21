import { test } from "@oclif/test";

describe("download", () => {
    test.command(["download", "invalid"]).exit(2).it("fails with arg");
});
