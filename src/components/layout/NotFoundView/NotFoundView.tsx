"use client";

import { SystemPage } from "components/layout/SystemPage";
import { ButtonLink } from "components/ui/Button";
import { useSystemMessages } from "i18n/SystemMessages";

export const NotFoundView = () => {
    const { homeHref, home, notFound, topBar } = useSystemMessages();

    return (
        <SystemPage
            topBar={topBar}
            label={notFound.label}
            heading={notFound.heading}
            text={notFound.text}
            command={notFound.command}
            result={notFound.result}
        >
            <ButtonLink href={homeHref} variant="primary">
                {home}
            </ButtonLink>
        </SystemPage>
    );
};
