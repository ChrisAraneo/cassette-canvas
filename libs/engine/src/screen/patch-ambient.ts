import type { Screen } from './types/screen';

/**
 * Sets the ambient light: how many extended shades every pixel moves up
 * (positive) or down (negative) before lights are added. Change it over time
 * to fade between day and night. Returns a new screen.
 */
export const patchAmbient = (screen: Screen, ambient: number): Screen => ({
  ...screen,
  ambient,
});
