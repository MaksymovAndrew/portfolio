const WORD_JOINERS = /[-_]+/g;

// an image's name reads like a path ("cooking-assistant / screenshot-1"); its last part, in words, stands in for the image
export const placeholderLabel = (name: string): string => {
    const last = name.split("/").at(-1)?.trim() ?? "";

    return (last === "" ? name : last).replaceAll(WORD_JOINERS, " ");
};
