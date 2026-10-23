import { REDUCED_MOTION_QUERY } from "constants/motion";

import { useMediaQuery } from "hooks/useMediaQuery";

// follows the system setting while the page is open
export const useReducedMotion = (): boolean =>
    useMediaQuery(REDUCED_MOTION_QUERY);
