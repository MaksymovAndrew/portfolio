/** @type {import("jest").Config} */
module.exports = {
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
    setupFilesAfterEnv: ["<rootDir>/src/test/jest.setup.ts"],
    clearMocks: true,
    restoreMocks: true,
    moduleNameMapper: {
        // the real module throws on import outside a server render
        "^server-only$": "<rootDir>/src/test/serverOnlyMock.ts",
        "\\.(css|scss|sass)$": "identity-obj-proxy",
        "\\.(svg|png|jpg|jpeg|gif|webp|avif|ttf|woff|woff2)$":
            "<rootDir>/src/test/fileMock.ts",
        // keep in sync with tsconfig.app.json "paths"
        "^app/(.*)$": "<rootDir>/src/app/$1",
        "^components/(.*)$": "<rootDir>/src/components/$1",
        "^config/(.*)$": "<rootDir>/src/config/$1",
        "^constants/(.*)$": "<rootDir>/src/constants/$1",
        "^guards/(.*)$": "<rootDir>/src/guards/$1",
        "^hooks/(.*)$": "<rootDir>/src/hooks/$1",
        "^i18n/(.*)$": "<rootDir>/src/i18n/$1",
        "^styles/(.*)$": "<rootDir>/src/styles/$1",
        "^test/(.*)$": "<rootDir>/src/test/$1",
        "^types/(.*)$": "<rootDir>/src/types/$1",
        "^utils/(.*)$": "<rootDir>/src/utils/$1",
        "^content$": "<rootDir>/content/index.ts",
        "^content/(.*)$": "<rootDir>/content/$1",
        "^theme/(.*)$": "<rootDir>/theme/$1",
    },
    transform: {
        "^.+\\.(t|j)sx?$": ["@swc/jest"],
    },
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/__tests__/**",
        "!src/test/**",
        // they read the real content and theme; their subject is not framework code
        "!src/guards/**",
        // route wiring only; page.tsx files hold the pages and stay measured
        "!src/app/**/layout.tsx",
        "!src/app/**/error.tsx",
        // barrels, no logic
        "!src/**/index.ts",
        // type-only modules, no runtime code
        "!src/types/**",
        "!src/env.d.ts",
    ],
    coverageProvider: "v8",
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
