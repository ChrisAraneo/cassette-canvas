import { filterOtherLights } from './internal/filter-other-lights';
import type { LightSettings } from './types/light-settings';
import type { Screen } from './types/screen';

/**
 * Adds a light to the screen. If a light with the same id exists, it is
 * replaced. Returns a new screen.
 */
export const addLight = (
  screen: Screen,
  id: string,
  { row, column, radius, intensity }: LightSettings,
): Screen => ({
  ...screen,
  lights: [
    ...filterOtherLights(screen.lights, id),
    { id, row, column, radius, intensity },
  ],
});
