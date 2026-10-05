import type { TerminalSource } from "types/content";

// the little terminal in the left column types these in a loop
export const terminal = {
    commands: [
        { command: "npm test", result: "✓ all tests passed" },
        { command: "npm run build", result: "✓ compiled successfully" },
        { command: "git push", result: "✓ CI green" },
    ],
} satisfies TerminalSource;
