import { STORAGE_KEYS } from "constants/storage";

import { createStore } from "utils/createStore";
import { writeStorage } from "utils/storage";

// null until the first choice, so that choice always reaches the listeners
const store = createStore<boolean | null>(null);

// the pre-paint script sets the flag from storage, so the page itself holds the choice
const readPaused = (): boolean =>
    document.documentElement.dataset.motion === "off";

// true means paused: what moves by itself stands still
export const motionStore = {
    subscribe: (listener: () => void): (() => void) =>
        store.subscribe(listener),
    getSnapshot: readPaused,
    getServerSnapshot: (): false => false,
    set: (paused: boolean): void => {
        const root = document.documentElement;

        writeStorage(STORAGE_KEYS.motion, paused ? "off" : "on");

        if (paused) {
            root.dataset.motion = "off";
        } else {
            delete root.dataset.motion;
        }

        store.set(paused);
    },
    toggle: (): void => {
        motionStore.set(!readPaused());
    },
};
