import { KeysAPI } from "../api/KeysAPI";

async function add(projectId: string, name: string, description?: string) {
    console.log("Add key");
    const response = await KeysAPI.createKey(projectId, name, description || "");
    console.error(response);

    if (response.errors) {
        console.error("returning -1");

        return -1;
    } else {
        return 0;
    }
}

export { add };
