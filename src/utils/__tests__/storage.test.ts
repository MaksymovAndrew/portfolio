import { writeStorage } from "utils/storage";

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
