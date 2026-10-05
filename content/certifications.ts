import type { CertificationsSource } from "types/content";

// an unknown date, id or link stays null and is simply not shown
const certificate = (title: string, name: string) => ({
    title,
    issuer: "Anthropic",
    date: null,
    credentialId: null,
    verifyHref: null,
    name: `certificates / ${name}`,
    image: null,
});

export const certifications = {
    label: { en: "certifications", pl: "certyfikaty", uk: "сертифікати" },
    nav: { en: "Certificates", pl: "Certyfikaty", uk: "Сертифікати" },
    verifyLabel: { en: "Verify", pl: "Zweryfikuj", uk: "Перевірити" },
    items: [
        certificate("Claude Code in Action", "claude-code-in-action"),
        certificate("[Certificate title]", "certificate-2"),
        certificate("[Certificate title]", "certificate-3"),
    ],
} satisfies CertificationsSource;
