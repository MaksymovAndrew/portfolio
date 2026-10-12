import { fireEvent, render, screen } from "@testing-library/react";

import { REDUCED_MOTION_QUERY } from "constants/motion";

import { MotionToggle } from "components/controls/MotionToggle";

import { motionStore } from "utils/motionStore";

import { content } from "test/fixtures/content";
import { matchMedia } from "test/shims/matchMedia";

const { motion } = content.ui;

describe("MotionToggle", () => {
    beforeEach(() => {
        motionStore.set(false);
    });

    it("should pause and resume the animations", () => {
        render(<MotionToggle labels={motion} />);

        fireEvent.click(screen.getByRole("button"));

        expect(document.documentElement.dataset.motion).toBe("off");

        fireEvent.click(screen.getByRole("button"));

        expect(document.documentElement).not.toHaveAttribute("data-motion");
    });

    it("should render nothing under reduced motion", () => {
        matchMedia(REDUCED_MOTION_QUERY);

        const { container } = render(<MotionToggle labels={motion} />);

        expect(container).toBeEmptyDOMElement();
    });
});
