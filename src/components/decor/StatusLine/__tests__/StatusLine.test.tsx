import { render, screen } from "@testing-library/react";

import { GLYPHS } from "constants/glyphs";

import { StatusLine } from "components/decor/StatusLine";

import { content } from "test/fixtures/content";

const { availability, city, timeZone } = content.profile;

describe("StatusLine", () => {
    beforeEach(() => {
        jest.useFakeTimers({ now: new Date("2026-01-15T12:00:00Z") });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should show the availability, the city and the local time", () => {
        render(
            <StatusLine
                availability={availability}
                city={city}
                timeZone={timeZone}
            />,
        );

        expect(screen.getByRole("paragraph")).toHaveTextContent(
            [availability, city, "13:00"].join(` ${GLYPHS.separator} `),
        );
    });
});
