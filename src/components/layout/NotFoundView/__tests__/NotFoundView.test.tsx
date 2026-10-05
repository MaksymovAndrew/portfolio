import { render, screen } from "@testing-library/react";

import { NotFoundView } from "components/layout/NotFoundView";
import { SystemMessagesProvider } from "i18n/SystemMessages";

import { content } from "test/fixtures/content";

const HOME_HREF = "/elsewhere";

describe("NotFoundView", () => {
    it("should show the messages of the page language", () => {
        const { ui } = content;

        render(
            <SystemMessagesProvider
                value={{
                    homeHref: HOME_HREF,
                    home: ui.home,
                    notFound: ui.notFound,
                    error: ui.error,
                }}
            >
                <NotFoundView />
            </SystemMessagesProvider>,
        );

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            ui.notFound.heading,
        );
        expect(screen.getByText(ui.notFound.text)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: ui.home })).toHaveAttribute(
            "href",
            HOME_HREF,
        );
    });
});
