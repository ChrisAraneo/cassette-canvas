import { computeTextAdvance } from '../../text/compute-text-advance';
import { TEXT_GAP } from '../../text/consts';

/**
 * Returns the width of a line of text in logical pixels, without the gap
 * after it.
 */
export const computeTextWidth = (text: string): number =>
  Math.max(0, computeTextAdvance(text) - TEXT_GAP);
