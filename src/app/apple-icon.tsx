import { monogramImage } from "app/monogramImage";

// what iOS asks for on the home screen
const APPLE_ICON_SIZE = 180;

export const size = { width: APPLE_ICON_SIZE, height: APPLE_ICON_SIZE };

export const contentType = "image/png";

const AppleIcon = () => monogramImage(APPLE_ICON_SIZE, "square");

export default AppleIcon;
