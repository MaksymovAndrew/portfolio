// jsdom has no View Transitions; a test turns them on as a current browser would, and every test starts without them
let available = false;
let aborting = false;
// the running transitions, oldest first
const running: (() => void)[] = [];

const startViewTransition = (
    update?: ViewTransitionUpdateCallback | StartViewTransitionOptions,
): ViewTransition => {
    if (typeof update === "function") {
        void update();
    }

    const finished = new Promise<void>((resolve) => {
        running.push(resolve);
    });

    return {
        finished,
        ready: aborting
            ? Promise.reject(new DOMException("Viewport size changed"))
            : Promise.resolve(),
        updateCallbackDone: Promise.resolve(),
        types: new Set<string>(),
        skipTransition: () => undefined,
    };
};

if (typeof document !== "undefined") {
    Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        get: () => (available ? startViewTransition : undefined),
    });
}

export const enableViewTransitions = (): void => {
    available = true;
};

// a transition a test left running ends too, so the page loses its flags
// the next transition is aborted before it starts animating, as a resized window does
export const abortNextViewTransition = (): void => {
    aborting = true;
};

export const disableViewTransitions = (): void => {
    available = false;
    aborting = false;
    running.splice(0).forEach((finish) => {
        finish();
    });
};

// the browser ends the oldest running transition: its animation is over, or a newer one skipped it
export const finishViewTransition = (): void => {
    running.shift()?.();
};
