import { flatMap } from 'lodash-es';
import type { HudWindow } from '../types/hud-window';
import { filterPageWidgets } from './filter-page-widgets';
import { toShownWidgets } from './to-shown-widgets';
import type { HudPlacedWidget } from './types/hud-placed-widget';

/**
 * Returns every widget a window shows right now, in the order it paints
 * them: the widgets of its open page, and after each list the widgets of the
 * items that list shows, each one moved to where it sits in the window.
 * Painting a window and pressing one both read this, so what the person sees
 * is what the pointer finds.
 */
export const toWindowWidgets = (
  window: HudWindow,
): readonly HudPlacedWidget[] =>
  flatMap(filterPageWidgets(window), toShownWidgets);
