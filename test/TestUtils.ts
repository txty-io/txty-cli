import fetch from "node-fetch";

export async function loadCLISeeds() {
    try {
        await fetch("http://localhost:3000/__cypress__/command", {
            method: "post",
            body: JSON.stringify({ name: "load_seed_cli", options: {} })
        });
    } catch (error) {
        console.error("Failed to load CLI test seeds.");
    }
}

export async function cleanDatabase() {
    try {
        await fetch("http://localhost:3000/__cypress__/command", {
            method: "post",
            body: JSON.stringify({ name: "clean", options: {} })
        });
    } catch (error) {
        console.error("Failed to clean database for test run.");
    }
}
