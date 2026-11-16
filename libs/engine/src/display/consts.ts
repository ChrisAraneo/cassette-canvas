/**
 * The most frames a second a display draws when its settings name no limit.
 * It is far above any monitor's refresh rate, so by default nothing is
 * skipped: pass `fps` to `tryCreateDisplay` to draw fewer.
 */
export const DEFAULT_MAX_FPS = 640;

/** How many bytes one pixel takes in a frame: red, green, blue and alpha. */
export const BYTES_PER_PIXEL = 4;
