import { render, screen } from "@testing-library/react";

import { CvLink } from "components/controls/CvLink";

const cv = { href: "/cv.pdf", label: "CV" };

describe("CvLink", () => {
    it("should offer the file as a download", () => {
        render(<CvLink cv={cv} />);

        const link = screen.getByRole("link", { name: cv.label });

        expect(link).toHaveAttribute("href", cv.href);
        expect(link).toHaveAttribute("download");
    });

    it("should render nothing without a file", () => {
        render(<CvLink cv={null} />);

        expect(() => screen.getByRole("link")).toThrow();
    });
});
