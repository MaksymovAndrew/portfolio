// the class names that apply, joined; false, null and undefined drop out
export const cx = (...names: (string | false | null | undefined)[]): string =>
    names.filter(Boolean).join(" ");
