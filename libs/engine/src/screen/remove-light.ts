import { filterOtherLights } from './internal/filter-other-lights';
import type { Screen } from './types/screen';

/** Removes the light with the id. Returns a new screen. */
export const removeLight = (screen: Screen, id: string): Screen => ({
  ...screen,
  lights: filterOtherLights(screen.lights, id),
});
