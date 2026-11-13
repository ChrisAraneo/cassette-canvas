import { HUD_LABEL_PADDING } from '../consts';
import { computeTextWidth } from './compute-text-width';

/**
 * Returns how wide a button or a tab has to be to hold its text, with
 * `HUD_LABEL_PADDING` columns of padding on each side.
 */
export const computeControlWidth = (text: string): number =>
  computeTextWidth(text) + 2 * HUD_LABEL_PADDING;
