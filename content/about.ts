import type { AboutSource } from "types/content";

export const about = {
    label: { en: "about", pl: "o mnie", uk: "про мене" },
    nav: { en: "About", pl: "O mnie", uk: "Про мене" },
    paragraphs: [
        {
            en: "Hey, I'm **Andrew** - a frontend developer who cares about the parts users never see: type safety, test coverage, and code that's still readable six months later.",
            pl: "Cześć, jestem **Andrew** - frontend developer, któremu zależy na tym, czego użytkownicy nie widzą: bezpieczeństwie typów, pokryciu testami i kodzie, który po pół roku wciąż da się czytać.",
            uk: "Привіт, я **Андрій** - фронтенд-розробник, якому важливо те, чого користувачі не бачать: типобезпека, покриття тестами й код, який легко читати навіть через пів року.",
        },
        {
            en: "I spent two years building and maintaining UI for a **production-scale iGaming platform** - real users, real money flows, real consequences when something breaks. That environment taught me to write declarative, composable, predictable code and to treat quality gates as a feature, not a chore.",
            pl: "Przez dwa lata budowałem i utrzymywałem UI **produkcyjnej platformy iGaming** - prawdziwi użytkownicy, prawdziwe przepływy pieniędzy i realne konsekwencje, gdy coś się psuje. To środowisko nauczyło mnie pisać deklaratywny, modularny i przewidywalny kod oraz traktować quality gates jak feature, a nie przykry obowiązek.",
            uk: "Два роки я будував і підтримував UI **продакшн-платформи iGaming** - реальні користувачі, реальні грошові потоки та реальні наслідки, коли щось ламається. Це середовище навчило мене писати декларативний, модульний і передбачуваний код та ставитися до quality gates як до фічі, а не тягаря.",
        },
        {
            en: "I'm currently pursuing a Software Engineering degree in Wrocław.",
            pl: "Obecnie studiuję inżynierię oprogramowania na studiach inżynierskich we Wrocławiu.",
            uk: "Наразі здобуваю ступінь інженера за напрямом Software Engineering у Вроцлаві.",
        },
        {
            en: "AI-assisted development is part of my daily workflow - **Claude Code** and **Codex** - backed by three Anthropic certifications.",
            pl: "Na co dzień pracuję z narzędziami AI do kodowania - **Claude Code** i **Codex** - co potwierdzają trzy certyfikaty Anthropic.",
            uk: "Щодня працюю з AI-інструментами для розробки - **Claude Code** і **Codex** - що підтверджують три сертифікати Anthropic.",
        },
    ],
    // addresses for [text](@key) links in the paragraphs
    refs: {},
} satisfies AboutSource;
