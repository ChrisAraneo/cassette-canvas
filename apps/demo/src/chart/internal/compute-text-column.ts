import { floor } from 'lodash-es';
import { GLYPH_GAP, GLYPH_PITCH } from '../../tiles/consts';
import { PANEL_WIDTH } from '../consts';

/**
 * Returns the column where text of `length` characters starts, so that it
 * sits in the middle of the panel that starts at `panel`.
 */
export const computeTextColumn = (length: number, panel: number): number =>
  panel + floor((PANEL_WIDTH - (length * GLYPH_PITCH - GLYPH_GAP)) / 2);
