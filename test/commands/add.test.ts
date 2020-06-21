import { test } from "@oclif/test";

describe("add", () => {
    test.command(["add"]).exit(2).it("fails without arg");
});
