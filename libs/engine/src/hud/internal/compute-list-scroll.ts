import { clamp, floor } from 'lodash-es';
import type { HudList } from '../types/hud-list';
import { computeListLastPage } from './compute-list-last-page';

/**
 * Returns a scroll a list can hold: a whole number of items, never below the
 * first item and never past the last page, which is 0 when every item the
 * list holds fits in it at once.
 */
export const computeListScroll = (widget: HudList, scroll: number): number =>
  clamp(floor(scroll), 0, computeListLastPage(widget));
