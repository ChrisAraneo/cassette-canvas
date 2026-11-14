/**
 * The most frames a second a display draws when its settings name no limit.
 * It is far above any monitor's refresh rate, so by default nothing is
 * skipped: pass `fps` to `tryCreateDisplay` to draw fewer.
 */
export const DEFAULT_MAX_FPS = 640;

/** How `fps` turns into the milliseconds one frame has to last. */
export const MILLISECONDS_PER_SECOND = 1000;
