"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";

import { usePointerEffects } from "hooks/usePointerEffects";

// the layer arrives with the first move of a mouse, so the page loads without it and a touch device never downloads it;
// it goes away with the mouse or once motion is reduced
export const PointerEffects = () => {
    const enabled = usePointerEffects();
    const [moved, setMoved] = useState(false);
    const [Layer, setLayer] = useState<ComponentType | null>(null);

    useEffect(() => {
        if (!enabled || moved) {
            return undefined;
        }

        const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "touch") {
                setMoved(true);
            }
        };

        window.addEventListener("pointermove", onMove, { passive: true });

        return () => {
            window.removeEventListener("pointermove", onMove);
        };
    }, [enabled, moved]);

    useEffect(() => {
        const notYet = !enabled || !moved || Layer !== null;

        if (notYet) {
            return undefined;
        }

        let current = true;

        // a chunk that fails to arrive (offline, a new deploy) leaves the system cursor
        import("components/effects/PointerLayer").then(
            ({ PointerLayer }) => {
                if (current) {
                    setLayer(() => PointerLayer);
                }
            },
            () => undefined,
        );

        return () => {
            current = false;
        };
    }, [enabled, moved, Layer]);

    return enabled && Layer !== null ? <Layer /> : null;
};
