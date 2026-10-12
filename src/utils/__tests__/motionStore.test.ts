import { STORAGE_KEYS } from "constants/storage";

import { motionStore } from "utils/motionStore";

const root = document.documentElement;

describe("motionStore", () => {
    beforeEach(() => {
        motionStore.set(false);
    });

    it("should set the attribute and store the choice", () => {
        motionStore.toggle();

        expect(root.dataset.motion).toBe("off");
        expect(localStorage.getItem(STORAGE_KEYS.motion)).toBe("off");
        expect(motionStore.getSnapshot()).toBe(true);

        motionStore.toggle();

        expect(root).not.toHaveAttribute("data-motion");
        expect(localStorage.getItem(STORAGE_KEYS.motion)).toBe("on");
        expect(motionStore.getSnapshot()).toBe(false);
    });

    it("should restore the choice", () => {
        root.dataset.motion = "off";

        expect(motionStore.getSnapshot()).toBe(true);
        expect(motionStore.getServerSnapshot()).toBe(false);
    });

    it("should tell its listeners about a change", () => {
        const seen: boolean[] = [];
        const unsubscribe = motionStore.subscribe(() =>
            seen.push(motionStore.getSnapshot()),
        );

        motionStore.set(true);
        motionStore.set(false);
        unsubscribe();
        motionStore.set(true);

        expect(seen).toEqual([true, false]);
    });

    it("should keep working when storage throws", () => {
        jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("storage is blocked");
        });

        motionStore.set(true);

        expect(root.dataset.motion).toBe("off");
    });
});
