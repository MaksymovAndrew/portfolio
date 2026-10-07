import type { Content } from "types/content";

import type { ViewerLabels } from "./Viewer";

// a file without hooks, so the server components that place a viewer can build its labels
export const toViewerLabels = ({
    ui,
    certifications,
}: Content): ViewerLabels => ({
    close: ui.close,
    previous: ui.viewer.previous,
    next: ui.viewer.next,
    verify: certifications.verifyLabel,
    externalHint: ui.external,
});
