import { match } from 'ts-pattern';
import type { HudListItemFit } from './types/hud-list-item-fit';

export const computeFitWithItem = (
  fit: HudListItemFit,
  pitch: number,
  room: number,
): HudListItemFit =>
  match(!fit.full && fit.used + pitch <= room)
    .with(true, () => ({
      count: fit.count + 1,
      used: fit.used + pitch,
      full: false,
    }))
    .otherwise(() => ({ ...fit, full: true }));
