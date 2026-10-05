"use client";

import { useSystemMessages } from "i18n/SystemMessages";

export const NotFoundView = () => {
    const { homeHref, home, notFound } = useSystemMessages();

    return (
        <main>
            <h1>{notFound.heading}</h1>
            <p>{notFound.text}</p>
            <a href={homeHref}>{home}</a>
        </main>
    );
};
