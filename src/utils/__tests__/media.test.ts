import { REDUCED_MOTION_QUERY } from "constants/motion";

import { onMediaChange, prefersReducedMotion } from "utils/media";

import { matchMedia } from "test/shims/matchMedia";

describe("media", () => {
    it("should read the reduced motion setting", () => {
        expect(prefersReducedMotion()).toBe(false);

        matchMedia(REDUCED_MOTION_QUERY);

        expect(prefersReducedMotion()).toBe(true);
    });

    it("should report a change of any query until stopped", () => {
        let changes = 0;
        const stop = onMediaChange(["(a)", "(b)"], () => {
            changes += 1;
        });

        matchMedia("(a)");
        matchMedia("(b)");
        stop();
        matchMedia("(a)");

        expect(changes).toBe(2);
    });
});
