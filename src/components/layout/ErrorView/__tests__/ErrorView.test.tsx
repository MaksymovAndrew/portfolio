import { fireEvent, render, screen } from "@testing-library/react";

import { ErrorView } from "components/layout/ErrorView";
import { SystemMessagesProvider } from "i18n/SystemMessages";

import { content } from "test/fixtures/content";

const HOME_HREF = "/elsewhere";
const PAGE_TITLE = "The page";
const { ui } = content;

const renderView = (onRetry: () => void = jest.fn()) =>
    render(
        <SystemMessagesProvider
            value={{
                homeHref: HOME_HREF,
                home: ui.home,
                notFound: ui.notFound,
                error: ui.error,
                topBar: null,
            }}
        >
            <ErrorView onRetry={onRetry} />
        </SystemMessagesProvider>,
    );

describe("ErrorView", () => {
    beforeEach(() => {
        document.title = PAGE_TITLE;
    });

    it("should show the messages of the page language", () => {
        renderView();

        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
            ui.error.heading,
        );
        expect(screen.getByText(ui.error.text)).toBeInTheDocument();
    });

    it("should move focus to the message", () => {
        renderView();

        expect(screen.getByRole("heading", { level: 1 })).toHaveFocus();
    });

    it("should name the tab after the error until it goes", () => {
        const { unmount } = renderView();

        expect(document.title).toBe(ui.error.title);

        unmount();

        expect(document.title).toBe(PAGE_TITLE);
    });

    it("should retry on the button", () => {
        const onRetry = jest.fn();

        renderView(onRetry);
        fireEvent.click(screen.getByRole("button", { name: ui.error.retry }));

        expect(onRetry.mock.calls).toHaveLength(1);
    });

    it("should link home", () => {
        renderView();

        expect(screen.getByRole("link", { name: ui.home })).toHaveAttribute(
            "href",
            HOME_HREF,
        );
    });
});
