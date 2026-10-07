// a step past either end comes back from the other one
export const wrapIndex = (
    index: number,
    delta: number,
    length: number,
): number => (((index + delta) % length) + length) % length;
