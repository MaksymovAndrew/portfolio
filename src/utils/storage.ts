// storage can be blocked (private mode, an embedded browser): the choice then lasts for this visit only
export const writeStorage = (key: string, value: string): boolean => {
    try {
        localStorage.setItem(key, value);

        return true;
    } catch {
        return false;
    }
};
