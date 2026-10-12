import { MAGNET, TILT } from "constants/motion";

export interface Point {
    x: number;
    y: number;
}

export interface Box {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface TiltPose {
    rotateX: number;
    rotateY: number;
    glareX: number;
    glareY: number;
}

// the middle of the box as a share of its size, and a share as a percentage
const MIDDLE = 0.5;
const PERCENT = 100;

const clamp = (value: number, limit: number): number =>
    Math.min(limit, Math.max(-limit, value));

// the box is where the element rests, without the offset it already follows
export const magnetOffset = (pointer: Point, box: Box): Point => {
    const dx = pointer.x - (box.left + box.width / 2);
    const dy = pointer.y - (box.top + box.height / 2);
    const near =
        Math.abs(dx) < box.width / 2 + MAGNET.zone &&
        Math.abs(dy) < box.height / 2 + MAGNET.zone;

    if (!near) {
        return { x: 0, y: 0 };
    }

    return {
        x: clamp(dx * MAGNET.strength, MAGNET.maxX),
        y: clamp(dy * MAGNET.strength, MAGNET.maxY),
    };
};

// glare is the pointer's place inside the box in percent
export const tiltPose = (pointer: Point, box: Box): TiltPose | null => {
    const nx = (pointer.x - box.left) / box.width;
    const ny = (pointer.y - box.top) / box.height;
    const inside = nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1;

    if (!inside) {
        return null;
    }

    return {
        rotateX: (MIDDLE - ny) * TILT.rotateX,
        rotateY: (nx - MIDDLE) * TILT.rotateY,
        glareX: nx * PERCENT,
        glareY: ny * PERCENT,
    };
};

// a circle from the origin that covers the whole window
export const circleRadius = (
    origin: Point,
    viewport: { width: number; height: number },
): number =>
    Math.hypot(
        Math.max(origin.x, viewport.width - origin.x),
        Math.max(origin.y, viewport.height - origin.y),
    );
