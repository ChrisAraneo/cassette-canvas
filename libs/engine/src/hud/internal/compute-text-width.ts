import { TEXT_GAP } from '../../text/consts';
import { measureText } from '../../text/measure-text';

/** The width of a line of text in logical pixels, without the gap after it. */
export const computeTextWidth = (text: string): number =>
  Math.max(0, measureText(text) - TEXT_GAP);
