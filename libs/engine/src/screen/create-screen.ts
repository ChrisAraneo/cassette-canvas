import { TRANSPARENT } from '../palette/consts';
import type { Screen } from './types/screen';

/**
 * Creates an empty screen, with no sprites, no lights, and no overlays,
 * filled with `background`. `ambient` shifts every pixel by that many
 * extended shades (4 extended shades = 1 sprite shade). For example, a night
 * scene could use -16.
 */
export const createScreen = (
  background: number = TRANSPARENT,
  ambient = 0,
): Screen => ({
  background,
  ambient,
  sprites: [],
  lights: [],
  overlays: [],
});
