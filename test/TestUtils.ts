import fetch, { Response } from "node-fetch";

export async function loadCLISeeds() {
    let response: Response | null = null;
    try {
        response = await fetch("http://localhost:3000/__cypress__/command", {
            method: "post",
            body: JSON.stringify({ name: "load_seed_cldi", options: {} })
        });
    } catch (error) {
        console.error("Failed to load CLI test seeds");
    }

    if (response !== null) {
        const jsonResponse = JSON.stringify(await response.json());
        if (response.status !== 201) {
            throw new Error(`Failed to execute cypress command: ${jsonResponse}`);
        } else {
            console.log("Successfully loaded 'load_seed_cli'", { code: response.status, response: jsonResponse });
        }
    }
}

export async function cleanDatabase() {
    let response: Response | null = null;
    try {
        response = await fetch("http://localhost:3000/__cypress__/command", {
            method: "post",
            body: JSON.stringify({ name: "clean", options: {} })
        });
    } catch (error) {
        console.error("Failed to clean database for test run");
    }

    if (response !== null) {
        const jsonResponse = JSON.stringify(await response.json());
        if (response.status !== 201) {
            throw new Error(`Failed to execute cypress command: ${jsonResponse}`);
        } else {
            console.log("Successfully loaded 'clean'", { code: response.status, response: jsonResponse });
        }
    }
}
