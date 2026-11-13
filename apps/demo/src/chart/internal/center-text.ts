import { floor } from 'lodash-es';
import { GLYPH_PITCH } from '../../tiles/place-text';
import { PANEL_WIDTH } from '../consts';

/**
 * Returns the column where text of `length` characters starts, so that it
 * sits in the middle of the panel that starts at `panel`.
 */
export const centerText = (length: number, panel: number): number =>
  panel + floor((PANEL_WIDTH - (length * GLYPH_PITCH - 1)) / 2);
