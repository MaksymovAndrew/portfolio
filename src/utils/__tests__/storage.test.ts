import { onStorageChange, writeStorage } from "utils/storage";

describe("writeStorage", () => {
    it("should store the value", () => {
        expect(writeStorage("key", "value")).toBe(true);
        expect(localStorage.getItem("key")).toBe("value");
    });

    it("should report a write that storage refuses", () => {
        jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("storage is blocked");
        });

        expect(writeStorage("key", "value")).toBe(false);
    });
});

describe("onStorageChange", () => {
    const write = (key: string, newValue: string) => {
        window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
    };

    it("should pass on what another tab wrote under its key", () => {
        const seen: (string | null)[] = [];
        const stop = onStorageChange("key", (value) => seen.push(value));

        write("other", "skipped");
        write("key", "value");
        stop();
        write("key", "late");

        expect(seen).toEqual(["value"]);
    });
});
