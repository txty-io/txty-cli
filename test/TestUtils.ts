import fetch, { Response } from "node-fetch";

export async function executeCypressCommand(options: { command: "load_seed_cli" | "clean" }) {
    let response: Response | null = null;
    try {
        response = await fetch("http://localhost:3000/__cypress__/command", {
            method: "post",
            body: JSON.stringify({ name: options.command, options: {} })
        });
    } catch (error) {
        console.error("Failed to load CLI test seeds");
    }

    if (response !== null) {
        const jsonResponse = JSON.stringify(await response.json());
        if (response.status !== 201) {
            throw new Error(`Failed to execute cypress command: ${jsonResponse}`);
        } else {
            console.log(`Successfully loaded "${options.command}"`, { code: response.status, response: jsonResponse });
        }
    }
}
