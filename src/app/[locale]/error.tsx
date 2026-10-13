"use client";

import { ErrorView } from "components/layout/ErrorView";

interface ErrorPageProps {
    retry: () => void;
}

// nothing is logged: the visitor's console is not a report, and the static pages have no server to send it to
const ErrorPage = ({ retry }: ErrorPageProps) => <ErrorView onRetry={retry} />;

export default ErrorPage;
