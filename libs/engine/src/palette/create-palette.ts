import { flatMap, fromPairs, map } from 'lodash-es';
import { pipe } from 'remeda';
import { createPaletteEntries } from './internal/create-palette-entries';
import { toRgb } from './internal/to-rgb';
import type { Palette } from './types/palette';
import type { PaletteColors } from './types/palette-colors';

/**
 * Expands the 16 base colors into 512 colors: 32 extended shades per color,
 * keyed by extended pixel.
 *
 * Sprite shade `s` is extended shade `4 * s + 1`. Shade `BASE_SHADE` is the
 * base color itself. Darker shades are mixed with black, lighter shades with
 * white. Only light reaches the extended shades between and beyond the
 * sprite shades. A color that is not in `#rrggbb` form is read as black.
 */
export const createPalette = (colors: PaletteColors): Palette =>
  pipe(
    map(colors, toRgb),
    (bases) => flatMap(bases, createPaletteEntries),
    (entries) => fromPairs(entries),
  );
