import { map, split, sum } from 'lodash-es';
import { TEXT_UNKNOWN_ADVANCE } from './consts';
import { GLYPHS } from './internal/glyphs';

/**
 * Returns how far a line of text moves the pen, in logical pixels. That is
 * the width of the text plus the `TEXT_GAP` column after its last character,
 * so it is also the column where the next line of text would start.
 * Characters the font does not know move the pen like a space.
 */
export const measureText = (text: string): number =>
  sum(
    map(
      split(text, ''),
      (character) => GLYPHS[character]?.advance ?? TEXT_UNKNOWN_ADVANCE,
    ),
  );
