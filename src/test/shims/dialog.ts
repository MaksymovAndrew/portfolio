// jsdom has <dialog> but neither showModal() nor close(); route handler tests run in node, which has no DOM at all
if (typeof HTMLDialogElement !== "undefined") {
    Object.assign(HTMLDialogElement.prototype, {
        showModal(this: HTMLDialogElement) {
            this.open = true;
        },
        close(this: HTMLDialogElement) {
            if (!this.open) {
                return;
            }

            this.open = false;
            this.dispatchEvent(new Event("close"));
        },
    });
}
