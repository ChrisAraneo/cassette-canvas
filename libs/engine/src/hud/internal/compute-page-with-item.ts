import { match } from 'ts-pattern';
import type { HudListLastPage } from './types/hud-list-last-page';

export const computePageWithItem = (
  page: HudListLastPage,
  index: number,
  pitch: number,
  room: number,
): HudListLastPage =>
  match(!page.full && page.used + pitch <= room)
    .with(true, () => ({
      start: index,
      used: page.used + pitch,
      full: false,
    }))
    .otherwise(() => ({ ...page, full: true }));
