"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { Content } from "types/content";

export interface SystemMessages {
    homeHref: string;
    home: string;
    notFound: Content["ui"]["notFound"];
    error: Content["ui"]["error"];
}

interface SystemMessagesProviderProps {
    value: SystemMessages;
    children: ReactNode;
}

const SystemMessagesContext = createContext<SystemMessages | null>(null);

// Next gives the 404 and error views no params, so the layout hands them the texts of its language
export const SystemMessagesProvider = ({
    value,
    children,
}: SystemMessagesProviderProps) => (
    <SystemMessagesContext value={value}>{children}</SystemMessagesContext>
);

export const useSystemMessages = (): SystemMessages => {
    const value = useContext(SystemMessagesContext);

    if (!value) {
        throw new Error(
            "useSystemMessages must be used inside SystemMessagesProvider",
        );
    }

    return value;
};
