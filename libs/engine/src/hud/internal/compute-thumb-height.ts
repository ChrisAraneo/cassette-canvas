import { floor } from 'lodash-es';
import { HUD_LIST_THUMB_HEIGHT } from '../consts';
import type { HudRect } from '../types/hud-rect';

export const computeThumbHeight = (
  track: HudRect,
  capacity: number,
  total: number,
): number =>
  Math.max(HUD_LIST_THUMB_HEIGHT, floor((track.height * capacity) / total));
