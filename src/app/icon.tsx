import { ICON_SIZES } from "constants/icons";

import { monogramImage } from "app/monogramImage";

interface IconProps {
    id: Promise<string>;
}

export const generateImageMetadata = () =>
    [...ICON_SIZES.tab, ...ICON_SIZES.app].map((size) => ({
        id: String(size),
        size: { width: size, height: size },
        contentType: "image/png",
    }));

// Next answers an id it did not generate with a 404 before this runs, so it is always a listed size
const Icon = async ({ id }: IconProps) =>
    monogramImage(Number(await id), "rounded");

export default Icon;
