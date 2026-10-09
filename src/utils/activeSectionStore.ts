import { ACTIVE_SECTION_MARGIN } from "constants/motion";
import type { SectionId } from "types/content";

import { createStore } from "utils/createStore";

const store = createStore<SectionId | null>(null);
const watched = new Map<Element, SectionId>();
let observer: IntersectionObserver | null = null;
let subscribers = 0;

// the current section dropping below the band means the reader went back above every section, to the first screen
const leavesDownward = (entry: IntersectionObserverEntry): boolean =>
    !entry.isIntersecting &&
    entry.rootBounds !== null &&
    entry.boundingClientRect.top > entry.rootBounds.bottom;

// leaving first, entering second: crossing from one section into the next arrives as one batch
const onEntries = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
        if (
            leavesDownward(entry) &&
            watched.get(entry.target) === store.getSnapshot()
        ) {
            store.set(null);
        }
    });
    entries.forEach((entry) => {
        const id = watched.get(entry.target);

        if (entry.isIntersecting && id) {
            store.set(id);
        }
    });
};

const watch = (ids: readonly SectionId[]) => {
    observer ??= new IntersectionObserver(onEntries, {
        rootMargin: ACTIVE_SECTION_MARGIN,
    });

    for (const id of ids) {
        const element = document.getElementById(id);

        if (element && !watched.has(element)) {
            watched.set(element, id);
            observer.observe(element);
        }
    }
};

// the sections a navigation lists; when none crosses the band the last one stays, unless the reader went back to the first screen
export const activeSectionStore = {
    subscribe: (
        listener: () => void,
        ids: readonly SectionId[],
    ): (() => void) => {
        const unsubscribe = store.subscribe(listener);

        watch(ids);
        subscribers += 1;

        return () => {
            unsubscribe();
            subscribers -= 1;

            if (subscribers === 0) {
                observer?.disconnect();
                observer = null;
                watched.clear();
                // nobody watches any more, so the value would go stale
                store.set(null);
            }
        };
    },
    getSnapshot: (): SectionId | null => store.getSnapshot(),
    getServerSnapshot: (): null => null,
};
