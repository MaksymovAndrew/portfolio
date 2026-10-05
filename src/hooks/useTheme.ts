import { useSyncExternalStore } from "react";

import type { ThemeMode } from "types/theme";

import { themeStore } from "utils/themeStore";

// null until hydrated: the server cannot know a stored choice
export const useTheme = (): { mode: ThemeMode | null; toggle: () => void } => ({
    mode: useSyncExternalStore(
        themeStore.subscribe,
        themeStore.getSnapshot,
        themeStore.getServerSnapshot,
    ),
    toggle: themeStore.toggle,
});
