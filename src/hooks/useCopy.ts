import { useCallback, useEffect, useRef, useState } from "react";

import { COPY_RESET_MS } from "constants/timing";

// a refused or missing clipboard (an insecure page, an old browser) selects the text instead, to be copied by hand
export const useCopy = (
    value: string,
    targetId: string,
): { copied: boolean; copy: () => Promise<void> } => {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stopTimer = useCallback(() => {
        if (timer.current !== null) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, []);

    useEffect(() => stopTimer, [stopTimer]);

    // the timer is cleared after the wait too: a second click may have set one meanwhile
    const copy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(value);
        } catch {
            stopTimer();
            setCopied(false);

            const target = document.getElementById(targetId);

            if (target) {
                window.getSelection()?.selectAllChildren(target);
            }

            return;
        }

        stopTimer();
        setCopied(true);
        timer.current = setTimeout(() => {
            timer.current = null;
            setCopied(false);
        }, COPY_RESET_MS);
    }, [stopTimer, targetId, value]);

    return { copied, copy };
};
