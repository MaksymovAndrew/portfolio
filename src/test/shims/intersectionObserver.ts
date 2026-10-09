// jsdom has no IntersectionObserver; a test plays the browser through intersect()
const observers = new Set<FakeIntersectionObserver>();

class FakeIntersectionObserver {
    readonly root = null;
    readonly rootMargin: string;
    readonly scrollMargin = "";
    readonly thresholds: readonly number[] = [];
    readonly targets = new Set<Element>();
    readonly callback: IntersectionObserverCallback;

    constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit,
    ) {
        this.callback = callback;
        this.rootMargin = options?.rootMargin ?? "";
        observers.add(this);
    }

    observe(target: Element) {
        this.targets.add(target);
    }

    unobserve(target: Element) {
        this.targets.delete(target);
    }

    disconnect() {
        this.targets.clear();
        observers.delete(this);
    }

    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }

    report(entry: IntersectionObserverEntry) {
        this.callback([entry], this);
    }
}

const rectAt = (top: number): DOMRectReadOnly => ({
    x: 0,
    y: top,
    top,
    left: 0,
    right: 0,
    bottom: top,
    width: 0,
    height: 0,
    toJSON: () => ({}),
});

if (typeof window !== "undefined") {
    Object.assign(window, { IntersectionObserver: FakeIntersectionObserver });
}

// what the browser reports when the target enters or leaves the observed area; top is its distance from the top of the window
export const intersect = (
    target: Element,
    isIntersecting: boolean,
    top = 0,
): void => {
    const rect = rectAt(top);

    observers.forEach((observer) => {
        if (observer.targets.has(target)) {
            observer.report({
                target,
                isIntersecting,
                intersectionRatio: isIntersecting ? 1 : 0,
                boundingClientRect: rect,
                intersectionRect: rect,
                // the observed area as a line at the top of the window: a target below it has a positive top
                rootBounds: rectAt(0),
                time: 0,
            });
        }
    });
};

// the same report for everything observed, when a test renders a single observer
export const intersectAll = (isIntersecting: boolean, top = 0): void => {
    observers.forEach((observer) => {
        observer.targets.forEach((target) => {
            intersect(target, isIntersecting, top);
        });
    });
};

export const isObserved = (target: Element): boolean =>
    [...observers].some((observer) => observer.targets.has(target));
