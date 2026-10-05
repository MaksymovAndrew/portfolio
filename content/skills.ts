import type { SkillsSource } from "types/content";

// the two rows drifting towards each other under the first screen
export const skills = {
    label: null,
    nav: null,
    rows: [
        [
            "React",
            "TypeScript",
            "JavaScript",
            "Next.js",
            "Redux",
            "RTK Query",
            "SCSS",
            "Tailwind CSS",
            "Storybook",
            "Vite",
            "Webpack",
            "WebSockets",
        ],
        [
            "Jest",
            "PostHog",
            "GitLab CI/CD",
            "GitHub Actions",
            "Docker",
            "PostgreSQL",
            "Oracle Cloud",
            "Azure",
            "ESLint",
            "SonarQube",
            "Husky",
            "Figma",
            "Claude Code",
        ],
    ],
} satisfies SkillsSource;
