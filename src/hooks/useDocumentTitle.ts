import { useEffect } from "react";

// borrows the tab while the component is shown; the page's own title stays in the head and comes back after
export const useDocumentTitle = (title: string): void => {
    useEffect(() => {
        const previous = document.title;

        document.title = title;

        return () => {
            document.title = previous;
        };
    }, [title]);
};
