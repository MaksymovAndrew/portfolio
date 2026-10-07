import { createContext, useContext } from "react";

export interface ViewerControls {
    open: (index: number, trigger: HTMLElement) => void;
}

export const ViewerContext = createContext<ViewerControls | null>(null);

export const useViewer = (): ViewerControls => {
    const controls = useContext(ViewerContext);

    if (!controls) {
        throw new Error("ViewerTrigger must be used inside ViewerRoot");
    }

    return controls;
};
