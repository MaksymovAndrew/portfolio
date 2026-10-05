import type { UiSource } from "types/content";

// interface words: labels for assistive technology, buttons, the 404 and error pages
export const ui = {
    skipToContent: {
        en: "Skip to content",
        pl: "Przejdź do treści",
        uk: "Перейти до вмісту",
    },
    languages: { en: "Language", pl: "Język", uk: "Мова" },
    theme: { en: "Change theme", pl: "Zmień motyw", uk: "Змінити тему" },
    sections: { en: "Sections", pl: "Sekcje", uk: "Розділи" },
    topBar: { en: "Top bar", pl: "Górny pasek", uk: "Верхня панель" },
    menu: {
        open: { en: "Open menu", pl: "Otwórz menu", uk: "Відкрити меню" },
        title: { en: "menu", pl: "menu", uk: "меню" },
    },
    close: { en: "Close", pl: "Zamknij", uk: "Закрити" },
    backToTop: {
        en: "Back to top",
        pl: "Wróć na górę",
        uk: "Повернутися вгору",
    },
    home: {
        en: "Back to home",
        pl: "Wróć na stronę główną",
        uk: "Повернутися на головну",
    },
    // the end of a period that is still going on
    present: { en: "Present", pl: "obecnie", uk: "дотепер" },
    // read out after the name of a link that opens in a new tab
    external: {
        en: "(opens in a new tab)",
        pl: "(otwiera się w nowej karcie)",
        uk: "(відкривається в новій вкладці)",
    },
    copy: {
        label: {
            en: "Copy email",
            pl: "Skopiuj adres e-mail",
            uk: "Скопіювати email",
        },
        done: { en: "copied", pl: "skopiowano", uk: "скопійовано" },
        status: {
            en: "Email copied",
            pl: "Adres e-mail skopiowany",
            uk: "Email скопійовано",
        },
    },
    motion: {
        pause: {
            en: "pause animations",
            pl: "wstrzymaj animacje",
            uk: "зупинити анімації",
        },
        resume: {
            en: "play animations",
            pl: "wznów animacje",
            uk: "відновити анімації",
        },
    },
    viewer: {
        openScreenshot: {
            en: "Open screenshot {index}",
            pl: "Otwórz zrzut ekranu {index}",
            uk: "Відкрити знімок екрана {index}",
        },
        openCertificate: {
            en: "Open certificate: {title}",
            pl: "Otwórz certyfikat: {title}",
            uk: "Відкрити сертифікат: {title}",
        },
        previous: { en: "Previous", pl: "Poprzedni", uk: "Попередній" },
        next: { en: "Next", pl: "Następny", uk: "Наступний" },
    },
    notFound: {
        label: { en: "404", pl: "404", uk: "404" },
        heading: {
            en: "This page doesn't exist.",
            pl: "Ta strona nie istnieje.",
            uk: "Такої сторінки не існує.",
        },
        text: {
            en: "The link is broken or the page has moved.",
            pl: "Link jest nieaktualny albo strona została przeniesiona.",
            uk: "Посилання зламане або сторінку перенесено.",
        },
        command: "cd /this-page",
        result: {
            en: "✗ no such file or directory",
            pl: "✗ nie ma takiego pliku ani katalogu",
            uk: "✗ немає такого файлу або каталогу",
        },
    },
    error: {
        label: { en: "error", pl: "błąd", uk: "помилка" },
        heading: {
            en: "Something went wrong.",
            pl: "Coś poszło nie tak.",
            uk: "Щось пішло не так.",
        },
        text: {
            en: "An unexpected error occurred. Try again - if it keeps happening, let me know.",
            pl: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie - jeśli się powtarza, daj mi znać.",
            uk: "Сталася неочікувана помилка. Спробуйте ще раз - якщо вона повторюється, напишіть мені.",
        },
        command: "npm start",
        result: {
            en: "✗ unexpected error",
            pl: "✗ nieoczekiwany błąd",
            uk: "✗ неочікувана помилка",
        },
        retry: {
            en: "Try again",
            pl: "Spróbuj ponownie",
            uk: "Спробувати ще раз",
        },
    },
} satisfies UiSource;
