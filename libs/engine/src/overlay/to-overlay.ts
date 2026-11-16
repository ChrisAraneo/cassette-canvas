import { size } from 'lodash-es';
import type { SpriteLegend } from '../palette/types/sprite-legend';
import { toOverlayPixels } from './internal/to-overlay-pixels';
import { toOverlayWidth } from './internal/to-overlay-width';
import type { Overlay } from './types/overlay';

/**
 * Builds an overlay from text art: one string per row, one character per
 * pixel. Each character is looked up in `legend`. The overlay is as wide as
 * the longest row. Characters that are not in the legend, and the places
 * where a row falls short, become transparent.
 */
export const toOverlay = (
  rows: readonly string[],
  legend: SpriteLegend,
): Overlay => ({
  width: toOverlayWidth(rows),
  height: size(rows),
  pixels: toOverlayPixels(rows, toOverlayWidth(rows), legend),
});
