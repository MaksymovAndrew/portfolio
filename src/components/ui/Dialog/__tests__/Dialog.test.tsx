import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

import { Dialog } from "components/ui/Dialog";

const LABEL = "Image viewer";

// the parent owns the open state, as every user of the dialog does
const Harness = () => {
    const [open, setOpen] = useState(true);

    return (
        <>
            <p>{open ? "open" : "closed"}</p>
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
                variant="window"
                label={LABEL}
            >
                <p>Inside</p>
            </Dialog>
        </>
    );
};

describe("Dialog", () => {
    it("should open as a modal", () => {
        const showModal = jest.spyOn(HTMLDialogElement.prototype, "showModal");

        render(<Harness />);

        expect(showModal.mock.calls).toEqual([[]]);
        expect(screen.getByRole("dialog", { name: LABEL })).toHaveAttribute(
            "open",
        );
    });

    it("should report closing through onClose", () => {
        render(<Harness />);

        // what the browser does on Escape
        act(() => {
            screen.getByRole<HTMLDialogElement>("dialog").close();
        });

        expect(screen.getByText("closed")).toBeInTheDocument();
    });

    it("should close on a backdrop click", () => {
        render(<Harness />);

        // the backdrop belongs to the dialog element itself
        fireEvent.pointerDown(screen.getByRole("dialog"));
        fireEvent.click(screen.getByRole("dialog"));

        expect(screen.getByText("closed")).toBeInTheDocument();
    });

    it("should stay open on a click inside", () => {
        render(<Harness />);

        fireEvent.pointerDown(screen.getByText("Inside"));
        fireEvent.click(screen.getByText("Inside"));

        expect(screen.getByText("open")).toBeInTheDocument();
        expect(screen.getByRole("dialog")).toHaveAttribute("open");
    });

    it("should stay open when a press inside ends on the backdrop", () => {
        render(<Harness />);

        // selecting text and letting go outside: the click lands on the dialog element
        fireEvent.pointerDown(screen.getByText("Inside"));
        fireEvent.click(screen.getByRole("dialog"));

        expect(screen.getByRole("dialog")).toHaveAttribute("open");
    });
});
