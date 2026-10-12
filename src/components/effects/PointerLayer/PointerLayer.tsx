"use client";

import { useEffect, useRef } from "react";

import styles from "./PointerLayer.module.scss";
import { startPointerEffects } from "./startPointerEffects";

// loaded only for a mouse or a trackpad; everything moves through transform on layers fixed to the window
export const PointerLayer = () => {
    const spot = useRef<HTMLDivElement>(null);
    const layer = useRef<HTMLDivElement>(null);
    const dot = useRef<HTMLDivElement>(null);
    const ring = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const [light, top, point, circle] = [
            spot.current,
            layer.current,
            dot.current,
            ring.current,
        ];
        const missing = !light || !top || !point || !circle;

        if (missing) {
            return undefined;
        }

        return startPointerEffects({
            spot: light,
            layer: top,
            dot: point,
            ring: circle,
        });
    }, []);

    return (
        <>
            <div
                ref={spot}
                className={styles["pointer-layer__spot"]}
                aria-hidden="true"
            />
            <div
                ref={layer}
                popover="manual"
                className={styles["pointer-layer"]}
                aria-hidden="true"
            >
                <div ref={dot} className={styles["pointer-layer__dot"]} />
                <div ref={ring} className={styles["pointer-layer__ring"]} />
            </div>
        </>
    );
};
