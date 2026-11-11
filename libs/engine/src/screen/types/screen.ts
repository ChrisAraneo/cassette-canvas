import type { Light } from './light';
import type { SpritePlacement } from './sprite-placement';

/**
 * Everything a display draws: a background pixel, sprites and lights.
 * Sprites are drawn in order, so later sprites cover earlier ones. `ambient`
 * shifts every pixel by that many extended shades before lights are added:
 * positive is lighter, negative is darker, and 0 keeps the authored colors.
 * 4 extended shades = 1 sprite shade.
 */
export interface Screen {
  readonly background: number;
  readonly ambient: number;
  readonly sprites: readonly SpritePlacement[];
  readonly lights: readonly Light[];
}
