import { createSignal } from "utils/signal";

describe("createSignal", () => {
    it("should start its source with the first listener and stop it with the last", () => {
        const events: string[] = [];
        const signal = createSignal(() => {
            events.push("start");

            return () => {
                events.push("stop");
            };
        });

        const first = signal.subscribe(() => undefined);
        const second = signal.subscribe(() => undefined);

        first();

        expect(events).toEqual(["start"]);

        second();

        expect(events).toEqual(["start", "stop"]);
    });

    it("should tell every listener when notified", () => {
        const signal = createSignal();
        let calls = 0;

        signal.subscribe(() => {
            calls += 1;
        });
        signal.subscribe(() => {
            calls += 1;
        });
        signal.notify();

        expect(calls).toBe(2);
    });
});
