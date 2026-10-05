/** @jest-environment node */
import { GET } from "app/health/route";

describe("health route", () => {
    it("should answer ok", async () => {
        const response = GET();

        expect(response.status).toBe(200);
        expect(await response.text()).toBe("ok");
    });
});
