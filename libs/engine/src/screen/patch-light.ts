import { map } from 'lodash-es';
import { patchMatchingLight } from './internal/patch-matching-light';
import type { LightChanges } from './types/light-changes';
import type { Screen } from './types/screen';

/**
 * Changes a light's `row`, `column`, `radius`, or `intensity`. Fields you
 * leave out keep their values. Returns a new screen. If no light has the id,
 * nothing changes.
 */
export const patchLight = (
  screen: Screen,
  id: string,
  changes: LightChanges,
): Screen => ({
  ...screen,
  lights: map(screen.lights, (light) => patchMatchingLight(light, id, changes)),
});
