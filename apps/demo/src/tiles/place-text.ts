import type { SpritePlacement } from '@cassette-canvas/engine';
import { flatMap, split } from 'lodash-es';
import { placeTiles } from './place-tiles';
import type { Font } from './types/font';

/** Characters are 5 pixels wide, with 1 pixel between them. */
export const GLYPH_PITCH = 6;

/**
 * Places a line of text with its top-left pixel at `row` and `column`.
 * Characters the font does not know, such as a space, leave a gap.
 */
export const placeText = (
  text: string,
  font: Font,
  { id, row, column }: Pick<SpritePlacement, 'id' | 'row' | 'column'>,
): SpritePlacement[] =>
  flatMap(split(text, ''), (character, index) =>
    placeTiles(font[character] ?? [], {
      id: `${id}-${index}`,
      row,
      column: column + index * GLYPH_PITCH,
      castsShadow: false,
    }),
  );
