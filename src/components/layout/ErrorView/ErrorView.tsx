"use client";

import { useEffect, useRef } from "react";

import { useDocumentTitle } from "hooks/useDocumentTitle";

import { SystemPage } from "components/layout/SystemPage";
import { Button, ButtonLink } from "components/ui/Button";
import { useSystemMessages } from "i18n/SystemMessages";

export interface ErrorViewProps {
    onRetry: () => void;
}

export const ErrorView = ({ onRetry }: ErrorViewProps) => {
    const { homeHref, home, error, topBar } = useSystemMessages();

    const heading = useRef<HTMLHeadingElement>(null);

    useDocumentTitle(error.title);

    // it swaps in where the reader was: the focused control is gone, the message takes its place
    useEffect(() => {
        heading.current?.focus();
    }, []);

    return (
        <SystemPage
            topBar={topBar}
            label={error.label}
            heading={error.heading}
            text={error.text}
            command={error.command}
            result={error.result}
            headingRef={heading}
        >
            <Button variant="primary" onClick={onRetry}>
                {error.retry}
            </Button>
            <ButtonLink href={homeHref} variant="ghost">
                {home}
            </ButtonLink>
        </SystemPage>
    );
};
