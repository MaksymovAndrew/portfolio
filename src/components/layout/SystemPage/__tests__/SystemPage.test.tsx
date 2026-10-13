import { render, screen } from "@testing-library/react";

import { SystemPage } from "components/layout/SystemPage";

import { content } from "test/fixtures/content";

const { notFound } = content.ui;

const renderPage = () =>
    render(
        <SystemPage
            topBar={<header>Top bar</header>}
            label={notFound.label}
            heading={notFound.heading}
            text={notFound.text}
            command={notFound.command}
            result={notFound.result}
        >
            <a href="#home">Home</a>
        </SystemPage>,
    );

describe("SystemPage", () => {
    it("should show the top bar above the message", () => {
        renderPage();

        expect(screen.getByRole("banner")).toHaveTextContent("Top bar");
        expect(screen.getByRole("main")).not.toHaveTextContent("Top bar");
    });

    it("should name the page in its only heading", () => {
        renderPage();

        expect(screen.getAllByRole("heading")).toEqual([
            screen.getByRole("heading", { level: 1, name: notFound.heading }),
        ]);
        expect(screen.getByText(notFound.label)).toBeInTheDocument();
        expect(screen.getByText(notFound.text)).toBeInTheDocument();
    });

    it("should print the command and its result", () => {
        renderPage();

        expect(screen.getByText(notFound.command)).toBeInTheDocument();
        expect(screen.getByText(notFound.result)).toBeInTheDocument();
    });

    it("should place the actions in the message", () => {
        renderPage();

        expect(screen.getByRole("main")).toContainElement(
            screen.getByRole("link", { name: "Home" }),
        );
    });
});
