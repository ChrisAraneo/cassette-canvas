import { constant, times } from 'lodash-es';
import { TRANSPARENT } from '../../palette/consts';
import { toCount } from '../to-count';
import type { OverlayPixels } from './types/overlay-pixels';
import type { OverlayRequest } from './types/overlay-request';

export const createOverlayPixels = ({
  width,
  height,
  paints,
}: OverlayRequest): OverlayPixels => ({
  width: toCount(width),
  height: toCount(height),
  paints,
  pixels: times(toCount(width) * toCount(height), constant(TRANSPARENT)),
});
