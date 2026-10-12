import { MAGNET, TILT } from "constants/motion";

import { circleRadius, magnetOffset, tiltPose } from "utils/pointer";

const BOX = { left: 100, top: 100, width: 200, height: 100 };
const CENTER = { x: 200, y: 150 };

describe("magnetOffset", () => {
    it("should stay still outside the zone around the element", () => {
        expect(magnetOffset({ x: 300 + MAGNET.zone + 1, y: 150 }, BOX)).toEqual(
            { x: 0, y: 0 },
        );
    });

    it("should pull towards the pointer in proportion inside the zone", () => {
        expect(magnetOffset({ x: 220, y: 160 }, BOX)).toEqual({
            x: 20 * MAGNET.strength,
            y: 10 * MAGNET.strength,
        });
    });

    it("should stay still with the pointer at the centre", () => {
        expect(magnetOffset(CENTER, BOX)).toEqual({ x: 0, y: 0 });
    });

    it("should clamp the pull near the edge of the zone", () => {
        expect(magnetOffset({ x: 320, y: 220 }, BOX)).toEqual({
            x: MAGNET.maxX,
            y: MAGNET.maxY,
        });
        expect(magnetOffset({ x: 80, y: 80 }, BOX)).toEqual({
            x: -MAGNET.maxX,
            y: -MAGNET.maxY,
        });
    });
});

describe("tiltPose", () => {
    it("should lie flat with the pointer at the centre", () => {
        expect(tiltPose(CENTER, BOX)).toEqual({
            rotateX: 0,
            rotateY: 0,
            glareX: 50,
            glareY: 50,
        });
    });

    it("should reach half the full swing at the corners", () => {
        expect(tiltPose({ x: 300, y: 100 }, BOX)).toEqual({
            rotateX: TILT.rotateX / 2,
            rotateY: TILT.rotateY / 2,
            glareX: 100,
            glareY: 0,
        });
        expect(tiltPose({ x: 100, y: 200 }, BOX)).toEqual({
            rotateX: -TILT.rotateX / 2,
            rotateY: -TILT.rotateY / 2,
            glareX: 0,
            glareY: 100,
        });
    });

    it("should give no pose outside the element", () => {
        expect(tiltPose({ x: 99, y: 150 }, BOX)).toBeNull();
        expect(tiltPose({ x: 200, y: 201 }, BOX)).toBeNull();
    });
});

describe("circleRadius", () => {
    const viewport = { width: 1000, height: 600 };

    it("should reach the farthest corner of the window", () => {
        expect(circleRadius({ x: 0, y: 0 }, viewport)).toBe(
            Math.hypot(1000, 600),
        );
        expect(circleRadius({ x: 900, y: 100 }, viewport)).toBe(
            Math.hypot(900, 500),
        );
    });

    it("should reach a corner from the middle of the window", () => {
        expect(circleRadius({ x: 500, y: 300 }, viewport)).toBe(
            Math.hypot(500, 300),
        );
    });
});
