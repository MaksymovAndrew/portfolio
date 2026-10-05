import { monogramImage } from "app/monogramImage";

// a browser tab asks for these
const ICON_SIZES = [16, 32];

interface IconProps {
    id: Promise<string>;
}

export const generateImageMetadata = () =>
    ICON_SIZES.map((size) => ({
        id: String(size),
        size: { width: size, height: size },
        contentType: "image/png",
    }));

// Next answers an id it did not generate with a 404 before this runs, so it is always a listed size
const Icon = async ({ id }: IconProps) =>
    monogramImage(Number(await id), "rounded");

export default Icon;
