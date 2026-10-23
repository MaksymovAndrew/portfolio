import { STORAGE_KEYS } from "constants/storage";

import { createSignal } from "utils/signal";
import { onStorageChange, writeStorage } from "utils/storage";

// the pre-paint script sets the flag from storage, so the page itself holds the choice
const readPaused = (): boolean =>
    document.documentElement.dataset.motion === "off";

const apply = (paused: boolean) => {
    const root = document.documentElement;

    if (paused) {
        root.dataset.motion = "off";
    } else {
        delete root.dataset.motion;
    }

    signal.notify();
};

// a choice made in another tab applies here too
const signal = createSignal(() =>
    onStorageChange(STORAGE_KEYS.motion, (value) => {
        if (value === "on" || value === "off") {
            apply(value === "off");
        }
    }),
);

// true means paused: what moves by itself stands still
export const motionStore = {
    subscribe: signal.subscribe,
    getSnapshot: readPaused,
    getServerSnapshot: (): false => false,
    set: (paused: boolean): void => {
        writeStorage(STORAGE_KEYS.motion, paused ? "off" : "on");
        apply(paused);
    },
    toggle: (): void => {
        motionStore.set(!readPaused());
    },
};
