import { useEffect } from "react";

import { hasModifier } from "utils/modifiers";

// the arrow keys step wherever the focus is; Alt+Left is the browser's Back, Ctrl and Cmd move by words or lines
export const useArrowKeys = (onStep: (delta: number) => void): void => {
    useEffect(() => {
        const stepByKey = (event: KeyboardEvent) => {
            if (hasModifier(event)) {
                return;
            }

            if (event.key === "ArrowRight") {
                onStep(1);
            }

            if (event.key === "ArrowLeft") {
                onStep(-1);
            }
        };

        document.addEventListener("keydown", stepByKey);

        return () => {
            document.removeEventListener("keydown", stepByKey);
        };
    }, [onStep]);
};
