import type { CertificationsSource } from "types/content";

// a Skilljar certificate: its code is the credential id and the end of the verify address
const certificate = (
    title: string,
    slug: string,
    date: string,
    code: string,
) => ({
    title,
    issuer: "Anthropic",
    date,
    credentialId: code,
    verifyHref: `https://verify.skilljar.com/c/${code}`,
    name: `certificates / ${slug}`,
    image: {
        src: `/images/certificates/${slug}.webp`,
        width: 1600,
        height: 1212,
        alt: {
            en: `Anthropic certificate of completion: ${title}, issued to Andrii Maksymov`,
            pl: `Certyfikat ukończenia kursu Anthropic: ${title}, wystawiony na nazwisko Andrii Maksymov`,
            uk: `Сертифікат Anthropic про проходження курсу ${title}, виданий на ім’я Andrii Maksymov`,
        },
    },
});

export const certifications = {
    label: { en: "certifications", pl: "certyfikaty", uk: "сертифікати" },
    nav: { en: "Certificates", pl: "Certyfikaty", uk: "Сертифікати" },
    verifyLabel: { en: "Verify", pl: "Zweryfikuj", uk: "Перевірити" },
    credentialLabel: { en: "ID {id}", pl: "ID {id}", uk: "ID {id}" },
    items: [
        certificate(
            "Introduction to agent skills",
            "introduction-to-agent-skills",
            "2026-07",
            "nckfeye7cmxe",
        ),
        certificate(
            "Claude Code 101",
            "claude-code-101",
            "2026-07",
            "9vbc8byzyqf3",
        ),
        certificate(
            "Claude Code in Action",
            "claude-code-in-action",
            "2026-04",
            "wh97sn9jdxrf",
        ),
    ],
} satisfies CertificationsSource;
