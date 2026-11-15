import type { SpritePlacement } from '@cassette-canvas/engine';
import { flatMap, split } from 'lodash-es';
import { GLYPH_PITCH } from './consts';
import { toTilePlacements } from './to-tile-placements';
import type { Font } from './types/font';

/**
 * Places a line of text with its top-left pixel at `row` and `column`.
 * Characters the font does not know, such as a space, leave a gap.
 */
export const toTextPlacements = (
  text: string,
  font: Font,
  { id, row, column }: Pick<SpritePlacement, 'id' | 'row' | 'column'>,
): SpritePlacement[] =>
  flatMap(split(text, ''), (character, index) =>
    toTilePlacements(font[character] ?? [], {
      id: `${id}-${index}`,
      row,
      column: column + index * GLYPH_PITCH,
      castsShadow: false,
    }),
  );
