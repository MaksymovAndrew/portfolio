import Image from "next/image";

import type { Content } from "types/content";

import { Placeholder } from "components/decor/Placeholder";

import { placeholderLabel } from "utils/placeholderLabel";

type PictureImage =
    Content["projects"]["items"][number]["screenshots"][number]["image"];

export interface PictureProps {
    image: PictureImage;
    name: string;
    sizes: string;
    className?: string;
    decorative?: boolean;
}

// the image, or its name in a placeholder while the file is not there; inside a named control it stays decorative
export const Picture = ({
    image,
    name,
    sizes,
    className,
    decorative = true,
}: PictureProps) =>
    image ? (
        <Image
            className={className}
            src={image.src}
            width={image.width}
            height={image.height}
            alt={decorative ? "" : image.alt}
            sizes={sizes}
        />
    ) : (
        <Placeholder label={placeholderLabel(name)} />
    );
