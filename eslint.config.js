import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier";
import deMorgan from "eslint-plugin-de-morgan";
import i18next from "eslint-plugin-i18next";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import testingLibrary from "eslint-plugin-testing-library";
import globals from "globals";
import tseslint from "typescript-eslint";

const ALIASES =
    "app|components|config|constants|content|guards|hooks|i18n|styles|test|theme|types|utils";

const TEST_FILES = ["**/__tests__/**", "src/test/**"];

// files drawn to an image or moved every frame: a stylesheet cannot reach them
const INLINE_STYLE_FILES = [
    "src/components/social/**",
    "src/components/effects/**",
    "src/app/icon.tsx",
    "src/app/apple-icon.tsx",
];

const preferNullRestrictions = [
    {
        selector:
            "BinaryExpression[operator='==='][right.type='Identifier'][right.name='undefined']",
        message: "Prefer null. Use === null instead of === undefined.",
    },
    {
        selector:
            "BinaryExpression[operator='!=='][right.type='Identifier'][right.name='undefined']",
        message: "Prefer null. Use !== null instead of !== undefined.",
    },
];

const HEX_COLOR = "/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/";
const COLOR_FUNCTION = "/\\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\\(/";
const ABSOLUTE_URL = "/^https?:\\u002F\\u002F/";

const colorRestrictions = [
    {
        selector: `Literal[value=${HEX_COLOR}]`,
        message: "Raw colour. Colours live in theme/theme.ts.",
    },
    {
        selector: `TemplateElement[value.raw=${HEX_COLOR}]`,
        message: "Raw colour. Colours live in theme/theme.ts.",
    },
    {
        selector: `Literal[value=${COLOR_FUNCTION}]`,
        message: "Raw colour. Colours live in theme/theme.ts.",
    },
    {
        selector: `TemplateElement[value.raw=${COLOR_FUNCTION}]`,
        message: "Raw colour. Colours live in theme/theme.ts.",
    },
];

const urlRestrictions = [
    {
        selector: `Literal[value=${ABSOLUTE_URL}]`,
        message:
            "Absolute address. Personal links live in content/, framework ones in src/constants/.",
    },
    {
        selector: `TemplateElement[value.raw=${ABSOLUTE_URL}]`,
        message:
            "Absolute address. Personal links live in content/, framework ones in src/constants/.",
    },
];

// i18next/no-literal-string skips template literals written as JSX children
const jsxTextRestrictions = [
    {
        selector:
            ":matches(JSXElement, JSXFragment) > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=/[A-Za-z]/]",
        message: "Literal text. User-facing text lives in content/.",
    },
];

const styleRestrictions = [
    {
        selector: "JSXAttribute[name.name='style']",
        message: "Inline style. Styles live in the component's SCSS module.",
    },
];

// a later block for the same files replaces the rule outright, so every block gets the full list
const restrictedSyntax = (...lists) => [
    "error",
    ...preferNullRestrictions,
    ...colorRestrictions,
    ...lists.flat(),
];

const noComplexCondition = {
    meta: {
        type: "suggestion",
        messages: {
            complex:
                "Condition has 3+ operands: extract it into a named constant.",
        },
    },
    create(context) {
        const count = (node) =>
            node?.type === "LogicalExpression"
                ? count(node.left) + count(node.right)
                : 1;
        const check = (test) => {
            if (test?.type === "LogicalExpression" && count(test) >= 3) {
                context.report({ node: test, messageId: "complex" });
            }
        };

        return {
            IfStatement: (node) => check(node.test),
            ConditionalExpression: (node) => check(node.test),
            WhileStatement: (node) => check(node.test),
            DoWhileStatement: (node) => check(node.test),
            ForStatement: (node) => check(node.test),
        };
    },
};

export default tseslint.config(
    includeIgnoreFile(fileURLToPath(new URL(".gitignore", import.meta.url))),
    {
        extends: [js.configs.recommended],
        files: ["**/*.{js,mjs,cjs}"],
        languageOptions: { globals: globals.node },
        rules: {
            eqeqeq: ["error", "always"],
            "no-var": "error",
            "prefer-const": "error",
            "no-console": "error",
        },
    },
    {
        files: ["**/*.cjs"],
        languageOptions: { sourceType: "commonjs" },
    },
    {
        // command-line tools: the console is their output
        files: ["scripts/**"],
        rules: { "no-console": "off" },
    },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
        ],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                // not projectService: the root tsconfig.json is Next's and covers app code only
                project: [
                    "./tsconfig.app.json",
                    "./tsconfig.node.json",
                    "./tsconfig.test.json",
                ],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-hooks/exhaustive-deps": "error",
            eqeqeq: ["error", "always"],
            "no-var": "error",
            "prefer-const": "error",
            "no-console": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/restrict-template-expressions": [
                "error",
                { allowNumber: true },
            ],
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "no-param-reassign": "error",
            "consistent-return": "error",
            "no-nested-ternary": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/naming-convention": [
                "error",
                { selector: "typeLike", format: ["PascalCase"] },
            ],
            "padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "*", next: "return" },
                {
                    blankLine: "always",
                    prev: ["const", "let", "var"],
                    next: "*",
                },
                {
                    blankLine: "any",
                    prev: ["const", "let", "var"],
                    next: ["const", "let", "var"],
                },
            ],
        },
    },
    {
        ...nextPlugin.configs["core-web-vitals"],
        files: ["src/**/*.{ts,tsx}"],
    },
    jsxA11y.flatConfigs.recommended,
    deMorgan.configs.recommended,
    {
        ...importPlugin.flatConfigs.recommended,
        files: ["**/*.{ts,tsx}"],
        rules: {
            ...importPlugin.flatConfigs.recommended.rules,
            "import/order": "off", // handed off to simple-import-sort
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: "./tsconfig.app.json",
                },
            },
        },
        rules: {
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        // side effects (styles, setup files)
                        ["^\\u0000"],
                        // external packages - starts with letter/@, but not our bare aliases
                        [`^(?!(?:${ALIASES})(?:/|$))@?\\w`],
                        ["^(?:config|constants|types)/"],
                        ["^(?:content|theme)(?:/|$)"],
                        ["^hooks/"],
                        ["^(?:components|i18n|styles)/"],
                        ["^utils/"],
                        ["^(?:app|guards|test)/"],
                        ["^\\."],
                    ],
                },
            ],
            "simple-import-sort/exports": "error",
            "import/no-unresolved": "error",
            // by syntax: import/no-relative-parent-imports wrongly flags tests importing their subject by alias
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            regex: "^\\.\\./",
                            message:
                                "Use bare path aliases (components/*, utils/*, ...) instead of ../ parent imports.",
                        },
                    ],
                },
            ],
            "no-restricted-syntax": ["error", ...preferNullRestrictions],
            "import/no-cycle": ["error", { maxDepth: 10 }],
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: [
                        "**/*.test.{ts,tsx}",
                        "**/__tests__/**",
                        "src/test/**",
                        "**/*.config.{ts,js,cjs}",
                    ],
                },
            ],
        },
    },
    {
        files: ["src/**/*.{ts,tsx}"],
        ignores: [...TEST_FILES, "src/constants/**", ...INLINE_STYLE_FILES],
        rules: {
            "no-restricted-syntax": restrictedSyntax(
                urlRestrictions,
                styleRestrictions,
                jsxTextRestrictions,
            ),
        },
    },
    {
        files: ["src/constants/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-syntax": restrictedSyntax(styleRestrictions),
        },
    },
    {
        files: INLINE_STYLE_FILES,
        ignores: TEST_FILES,
        rules: {
            "no-restricted-syntax": restrictedSyntax(
                urlRestrictions,
                jsxTextRestrictions,
            ),
        },
    },
    {
        // .tsx is exempt: presentational sizes in JSX props are not logic
        files: ["src/**/*.ts"],
        ignores: ["src/constants/**", "src/config/**", ...TEST_FILES],
        rules: {
            "@typescript-eslint/no-magic-numbers": [
                "error",
                {
                    ignore: [-1, 0, 1, 2],
                    ignoreDefaultValues: true,
                    ignoreClassFieldInitialValues: true,
                    ignoreEnums: true,
                    ignoreNumericLiteralTypes: true,
                    ignoreReadonlyClassProperties: true,
                    ignoreTypeIndexes: true,
                    detectObjects: false,
                },
            ],
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        ignores: ["**/__tests__/**/*.{ts,tsx}"],
        rules: {
            // a hard ceiling only - the working norm is 100 lines
            "max-lines": [
                "error",
                { max: 250, skipBlankLines: true, skipComments: true },
            ],
            "max-lines-per-function": [
                "error",
                { max: 250, skipBlankLines: true, skipComments: true },
            ],
            complexity: ["error", 15],
        },
    },
    {
        files: ["src/**/*.{ts,tsx}"],
        plugins: {
            local: { rules: { "no-complex-condition": noComplexCondition } },
        },
        rules: { "local/no-complex-condition": "error" },
    },
    {
        files: ["src/**/*.{ts,tsx}", "content/**/*.ts", "theme/**/*.ts"],
        plugins: { boundaries },
        settings: {
            "boundaries/elements": [
                { type: "content", pattern: "content/**" },
                { type: "theme", pattern: "theme/**" },
                { type: "guards", pattern: "src/guards/**" },
                { type: "social", pattern: "src/components/social/**" },
                { type: "config", pattern: "src/config/**" },
                { type: "types", pattern: "src/types/**" },
                { type: "constants", pattern: "src/constants/**" },
                { type: "i18n", pattern: "src/i18n/**" },
                { type: "utils", pattern: "src/utils/**" },
                { type: "hooks", pattern: "src/hooks/**" },
                { type: "components", pattern: "src/components/**" },
                { type: "app", pattern: "src/app/**" },
                { type: "test", pattern: "src/test/**" },
                // last: any other file under src, so no file escapes the policies below
                { type: "src", pattern: "src/**" },
            ],
        },
        rules: {
            "boundaries/dependencies": [
                "error",
                {
                    checkAllOrigins: true,
                    default: "allow",
                    policies: [
                        {
                            from: {
                                element: {
                                    types: {
                                        anyOf: ["components", "social"],
                                    },
                                },
                            },
                            disallow: {
                                to: { element: { types: ["app"] } },
                            },
                            message: "Components must not import pages.",
                        },
                        {
                            from: {
                                element: {
                                    types: {
                                        anyOf: [
                                            "theme",
                                            "social",
                                            "config",
                                            "types",
                                            "constants",
                                            "utils",
                                            "hooks",
                                            "components",
                                            "app",
                                            "test",
                                            "src",
                                        ],
                                    },
                                },
                            },
                            disallow: {
                                to: { element: { types: ["content"] } },
                            },
                            message:
                                "Only src/i18n and src/guards read content/. Take the texts from getContent or through props.",
                        },
                        {
                            from: {
                                element: {
                                    types: {
                                        anyOf: [
                                            "content",
                                            "config",
                                            "types",
                                            "constants",
                                            "i18n",
                                            "utils",
                                            "hooks",
                                            "components",
                                            "test",
                                            "src",
                                        ],
                                    },
                                },
                            },
                            disallow: {
                                to: { element: { types: ["theme"] } },
                            },
                            message:
                                "Only src/app and src/components/social read theme/. Use the CSS variables instead.",
                        },
                    ],
                },
            ],
        },
    },
    {
        files: [
            "src/app/**/*.{ts,tsx}",
            "src/components/**/*.{ts,tsx}",
            "src/hooks/**/*.{ts,tsx}",
            "src/i18n/**/*.{ts,tsx}",
        ],
        ignores: ["**/__tests__/**"],
        plugins: { i18next },
        rules: {
            "i18next/no-literal-string": [
                "error",
                {
                    mode: "jsx-only",
                    "jsx-attributes": {
                        exclude: [
                            "className",
                            "styleName",
                            "style",
                            "type",
                            "key",
                            "id",
                            "width",
                            "height",
                        ],
                    },
                },
            ],
        },
    },
    {
        // Next finds pages, layouts and route files by their default export
        files: ["src/**/*.{ts,tsx}", "content/**/*.ts", "theme/**/*.ts"],
        ignores: ["src/app/**", "src/test/**"],
        rules: {
            "import/no-default-export": "error",
        },
    },
    {
        // jest.fn() mocks have no `this` binding, so unbound-method is a false positive in test code
        files: ["**/__tests__/**/*.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
        rules: {
            "@typescript-eslint/unbound-method": "off",
        },
    },
    {
        ...testingLibrary.configs["flat/react"],
        files: ["**/__tests__/**/*.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
    },
    prettier,
    {
        // eslint-config-prettier turns curly off, but its "all" form never conflicts with Prettier
        rules: { curly: ["error", "all"] },
    },
);
