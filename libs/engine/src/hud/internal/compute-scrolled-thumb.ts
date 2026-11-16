import { floor } from 'lodash-es';
import type { HudRect } from '../types/hud-rect';

export const computeScrolledThumb = (
  track: HudRect,
  height: number,
  scroll: number,
  lastPage: number,
): HudRect => ({
  ...track,
  row: track.row + floor(((track.height - height) * scroll) / lastPage),
  height,
});
