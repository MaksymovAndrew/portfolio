import {
    ACTIVE_SECTION_MARGIN,
    END_VISIBLE_RATIO,
    SCROLL_KEYS,
} from "constants/motion";
import type { SectionId } from "types/content";

import { createStore } from "utils/createStore";

const store = createStore<SectionId | null>(null);
const watched = new Map<Element, SectionId>();
const inBand = new Set<Element>();
let bandObserver: IntersectionObserver | null = null;
let endObserver: IntersectionObserver | null = null;
let lastSection: Element | null = null;
let lastInView = false;
let held = false;
let subscribers = 0;
let stopListening: (() => void) | null = null;

// sections are siblings, never nested, so the position is plainly before or after
const byPageOrder = (first: Element, second: Element): number =>
    first.compareDocumentPosition(second) === Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1;

// the current section dropping below the band means the reader went back above every section, to the first screen
const leavesDownward = (entry: IntersectionObserverEntry): boolean =>
    !entry.isIntersecting &&
    entry.rootBounds !== null &&
    entry.boundingClientRect.top > entry.rootBounds.bottom;

// the last section in full view means the page is at its end; else the topmost section in the band
const settle = () => {
    if (held) {
        return;
    }

    const [topmost] = [...inBand].sort(byPageOrder);
    const shown = lastInView && lastSection ? lastSection : topmost;

    if (shown) {
        store.set(watched.get(shown) ?? null);
    }
};

const onBand = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            inBand.add(entry.target);

            return;
        }

        inBand.delete(entry.target);

        const wasCurrent = watched.get(entry.target) === store.getSnapshot();
        const backToFirstScreen = !held && wasCurrent && leavesDownward(entry);

        if (backToFirstScreen) {
            store.set(null);
        }
    });
    settle();
};

const onEnd = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
        lastInView = entry.intersectionRatio >= END_VISIBLE_RATIO;
    });
    settle();
};

// the reader scrolls again: the section a link chose gives way to what the window shows
const release = () => {
    window.removeEventListener("scrollend", releaseOnNextScroll);
    window.removeEventListener("scroll", release);

    if (held) {
        held = false;
        settle();
    }
};

// once the link's own scroll has ended, any further scroll is the reader's: Tab, find in page, the scrollbar
function releaseOnNextScroll() {
    window.addEventListener("scroll", release, { once: true, passive: true });
}

const onKey = (event: KeyboardEvent) => {
    if (SCROLL_KEYS.includes(event.key)) {
        release();
    }
};

// a press on the page's own scrollbar lands on the root element
const onPointer = (event: PointerEvent) => {
    if (event.target === document.documentElement) {
        release();
    }
};

const listen = (): (() => void) => {
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);

    return () => {
        window.removeEventListener("wheel", release);
        window.removeEventListener("touchmove", release);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("pointerdown", onPointer);
    };
};

const watch = (ids: readonly SectionId[]) => {
    bandObserver ??= new IntersectionObserver(onBand, {
        rootMargin: ACTIVE_SECTION_MARGIN,
    });
    endObserver ??= new IntersectionObserver(onEnd, {
        threshold: END_VISIBLE_RATIO,
    });

    for (const id of ids) {
        const element = document.getElementById(id);

        if (element && !watched.has(element)) {
            watched.set(element, id);
            bandObserver.observe(element);
        }
    }

    const [last] = [...watched.keys()].sort(byPageOrder).reverse();

    if (last && last !== lastSection) {
        if (lastSection) {
            endObserver.unobserve(lastSection);
        }

        lastSection = last;
        lastInView = false;
        endObserver.observe(last);
    }
};

const forget = () => {
    bandObserver?.disconnect();
    endObserver?.disconnect();
    bandObserver = null;
    endObserver = null;
    watched.clear();
    inBand.clear();
    lastSection = null;
    lastInView = false;
    release();
    // nobody watches any more, so the value would go stale
    store.set(null);
};

// the sections a navigation lists; when none crosses the band the last one stays, unless the reader went back to the first screen
export const activeSectionStore = {
    subscribe: (
        listener: () => void,
        ids: readonly SectionId[],
    ): (() => void) => {
        const unsubscribe = store.subscribe(listener);

        watch(ids);

        stopListening ??= listen();

        subscribers += 1;

        return () => {
            unsubscribe();
            subscribers -= 1;

            if (subscribers === 0) {
                stopListening?.();
                stopListening = null;
                forget();
            }
        };
    },
    getSnapshot: (): SectionId | null => store.getSnapshot(),
    getServerSnapshot: (): null => null,
    // a chosen link marks its section at once and keeps it while the page scrolls there
    hold: (id: SectionId): void => {
        release();
        held = true;
        store.set(id);
        window.addEventListener("scrollend", releaseOnNextScroll, {
            once: true,
        });
    },
};
