import { render, screen } from "@testing-library/react";

import { LocaleSwitcher } from "components/controls/LocaleSwitcher";

const LABEL = "Language";

const ENGLISH = {
    locale: "en",
    href: "/",
    label: "EN",
    name: "English",
    current: true,
};

const GERMAN = {
    locale: "de",
    href: "/de",
    label: "DE",
    name: "Deutsch",
    current: false,
};

describe("LocaleSwitcher", () => {
    it("should link every language to its page", () => {
        render(<LocaleSwitcher links={[ENGLISH, GERMAN]} label={LABEL} />);

        const link = screen.getByRole("link", { name: "DE Deutsch" });

        expect(link).toHaveAttribute("href", "/de");
        expect(link).toHaveAttribute("hreflang", "de");
        expect(link).toHaveAttribute("lang", "de");
    });

    it("should mark the language of the page", () => {
        render(<LocaleSwitcher links={[ENGLISH, GERMAN]} label={LABEL} />);

        expect(
            screen.getByRole("link", { name: "EN English" }),
        ).toHaveAttribute("aria-current", "page");
        expect(
            screen.getByRole("link", { name: "DE Deutsch" }),
        ).not.toHaveAttribute("aria-current");
    });

    it("should name the group of links", () => {
        render(<LocaleSwitcher links={[ENGLISH, GERMAN]} label={LABEL} />);

        expect(screen.getByRole("group", { name: LABEL })).toBeInTheDocument();
    });

    it("should render nothing for a single language", () => {
        render(<LocaleSwitcher links={[ENGLISH]} label={LABEL} />);

        expect(() => screen.getByRole("link")).toThrow();
    });
});
