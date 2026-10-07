// how wide each kind of image is drawn, so the browser fetches no larger file than it shows
export const IMAGE_SIZES = {
    thumbnail: "(width < 1024px) 30vw, 190px",
    viewer: "(width < 1024px) 100vw, 940px",
} as const;
