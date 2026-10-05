import { createStore } from "utils/createStore";

describe("createStore", () => {
    it("should hold its value and tell every listener about a change", () => {
        const store = createStore(1);
        const seen: number[] = [];

        store.subscribe(() => seen.push(store.getSnapshot()));
        store.set(2);

        expect(store.getSnapshot()).toBe(2);
        expect(seen).toEqual([2]);
    });

    it("should stay quiet when the value does not change", () => {
        const store = createStore("a");
        const seen: string[] = [];

        store.subscribe(() => seen.push(store.getSnapshot()));
        store.set("a");

        expect(seen).toEqual([]);
    });

    it("should stop telling a listener that left", () => {
        const store = createStore(1);
        const seen: number[] = [];
        const unsubscribe = store.subscribe(() =>
            seen.push(store.getSnapshot()),
        );

        unsubscribe();
        store.set(2);

        expect(seen).toEqual([]);
    });
});
