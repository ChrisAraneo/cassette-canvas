import { match } from 'ts-pattern';
import { HUD_LIST_THUMB_HEIGHT } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeScrolledThumb } from './compute-scrolled-thumb';
import { computeThumbHeight } from './compute-thumb-height';

export const computeThumbRect = (
  track: HudRect,
  capacity: number,
  total: number,
  scroll: number,
  lastPage: number,
): HudRect =>
  match(lastPage <= 0 || track.height < HUD_LIST_THUMB_HEIGHT)
    .with(true, () => ({ ...track, height: 0 }))
    .otherwise(() =>
      computeScrolledThumb(
        track,
        computeThumbHeight(track, capacity, total),
        scroll,
        lastPage,
      ),
    );
