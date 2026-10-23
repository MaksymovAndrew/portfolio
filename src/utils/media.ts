import { REDUCED_MOTION_QUERY } from "constants/motion";

export const matchesMedia = (query: string): boolean =>
    window.matchMedia(query).matches;

export const prefersReducedMotion = (): boolean =>
    matchesMedia(REDUCED_MOTION_QUERY);

// a change of any of the queries reaches the listener
export const onMediaChange = (
    queries: readonly string[],
    listener: () => void,
): (() => void) => {
    const lists = queries.map((query) => window.matchMedia(query));

    lists.forEach((list) => {
        list.addEventListener("change", listener);
    });

    return () => {
        lists.forEach((list) => {
            list.removeEventListener("change", listener);
        });
    };
};
