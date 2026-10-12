import type { MotionValue } from "motion";
import { cancelFrame, frame, springValue } from "motion";

import { SPRINGS } from "constants/motion";

// a value that follows its latest target along one of the tuned springs
export const spring = (
    name: keyof typeof SPRINGS,
    initial = 0,
): MotionValue<number> => springValue(initial, { ...SPRINGS[name], mass: 1 });

// draws once per frame whichever of the values moved
export const watch = (
    values: MotionValue<number>[],
    render: () => void,
): (() => void) => {
    const schedule = () => {
        frame.render(render);
    };
    const offs = values.map((value) => value.on("change", schedule));

    return () => {
        // a frame already asked for would draw again over the cleared element
        cancelFrame(render);
        offs.forEach((off) => {
            off();
        });
        values.forEach((value) => {
            value.destroy();
        });
    };
};
