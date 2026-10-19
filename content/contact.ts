import type { ContactSource } from "types/content";

export const contact = {
    label: { en: "get in touch", pl: "kontakt", uk: "зв’язатися" },
    nav: { en: "Contact", pl: "Kontakt", uk: "Контакти" },
    heading: {
        en: "Let's build something.",
        pl: "Stwórzmy coś razem.",
        uk: "Створімо щось разом.",
    },
    text: {
        en: "Open to remote frontend roles. The fastest way to reach me is email or Telegram.",
        pl: "Szukam w pełni zdalnej pracy jako frontend developer. Najszybciej odpowiem na e-mail lub wiadomość na Telegramie.",
        uk: "Відкритий до віддалених frontend-позицій. Найшвидший спосіб зв’язатися - email або Telegram.",
    },
} satisfies ContactSource;
