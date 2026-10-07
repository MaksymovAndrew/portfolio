import { act, fireEvent, render, screen } from "@testing-library/react";

import { CopyButton } from "components/controls/CopyButton";

import { content } from "test/fixtures/content";
import { removeClipboard } from "test/shims/clipboard";

const { profile, ui } = content;

const TARGET_ID = "address";

const renderButton = () =>
    render(
        <>
            <span id={TARGET_ID}>{profile.email}</span>
            <CopyButton
                value={profile.email}
                targetId={TARGET_ID}
                labels={ui.copy}
            />
        </>,
    );

// the copy waits for the clipboard: let its promise settle before looking
const clickCopy = async () => {
    fireEvent.click(screen.getByRole("button", { name: ui.copy.label }));

    await act(async () => {
        await Promise.resolve();
    });
};

describe("CopyButton", () => {
    it("should name itself from the content", () => {
        renderButton();

        expect(
            screen.getByRole("button", { name: ui.copy.label }),
        ).toHaveAttribute("title", ui.copy.label);
    });

    it("should announce the copy in the status region", async () => {
        renderButton();

        expect(screen.getByRole("status")).not.toHaveTextContent(
            ui.copy.status,
        );

        await clickCopy();

        expect(screen.getByRole("status")).toHaveTextContent(ui.copy.status);
        expect(
            screen.getByRole("button", { name: ui.copy.label }),
        ).toHaveTextContent(ui.copy.done);
    });

    it("should claim no copy when the clipboard is missing", async () => {
        removeClipboard();
        renderButton();

        await clickCopy();

        expect(screen.getByRole("status")).not.toHaveTextContent(
            ui.copy.status,
        );
        expect(
            screen.getByRole("button", { name: ui.copy.label }),
        ).not.toHaveTextContent(ui.copy.done);
    });
});
