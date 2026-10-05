import { render, screen } from "@testing-library/react";

import { Monogram } from "components/social/Monogram";

// written as the DOM reports colours, so the styles compare as they are
const palette = {
    bg: "rgb(0, 0, 0)",
    line: "rgb(51, 51, 51)",
    text: "rgb(255, 255, 255)",
    accent: "rgb(0, 170, 255)",
};

describe("Monogram", () => {
    it("should draw the initials with the dot in the accent colour", () => {
        render(
            <Monogram
                initials="JE"
                size={32}
                palette={palette}
                shape="rounded"
            />,
        );

        expect(screen.getByText("JE").style.color).toBe(palette.text);
        expect(screen.getByText(".").style.color).toBe(palette.accent);
    });

    it("should round the corners for a tab", () => {
        render(
            <Monogram
                initials="JE"
                size={32}
                palette={palette}
                shape="rounded"
            />,
        );

        expect(screen.getByText("JE").style.borderRadius).toBe("22%");
    });

    it("should keep a visible corner on the smallest icon", () => {
        render(
            <Monogram
                initials="JE"
                size={16}
                palette={palette}
                shape="rounded"
            />,
        );

        expect(screen.getByText("JE").style.borderRadius).toBe("3px");
    });

    it("should fill a square for the home screen", () => {
        render(
            <Monogram
                initials="JE"
                size={180}
                palette={palette}
                shape="square"
            />,
        );

        expect(screen.getByText("JE").style.borderRadius).toBe("");
    });
});
