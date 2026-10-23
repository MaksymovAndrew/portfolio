// Waiting on a local server that the scripts started.
import { setTimeout as delay } from "node:timers/promises";

const SERVER_START_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 250;

// anything answering there, even with an error
export const answers = (url) =>
    fetch(url).then(
        () => true,
        () => false,
    );

export const isUp = (url) =>
    fetch(url).then(
        (response) => response.ok,
        () => false,
    );

export const waitForServer = async (baseUrl) => {
    const deadline = Date.now() + SERVER_START_TIMEOUT_MS;

    while (!(await isUp(`${baseUrl}/health`))) {
        if (Date.now() > deadline) {
            throw new Error(`The server did not answer on ${baseUrl}.`);
        }

        await delay(POLL_INTERVAL_MS);
    }
};
