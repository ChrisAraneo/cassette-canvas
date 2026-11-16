import { flatMap } from 'lodash-es';
import type { HudList } from '../types/hud-list';
import { computeListLayout } from './compute-list-layout';
import { toItemWidgets } from './to-item-widgets';
import type { HudPlacedWidget } from './types/hud-placed-widget';

/**
 * Returns every widget a list shows right now, in the order it paints them:
 * the list itself, and after it the widgets of the items it shows, each one
 * moved to where it sits in the window.
 */
export const toListWidgets = (list: HudList): readonly HudPlacedWidget[] => [
  { widget: list, item: '' },
  ...flatMap(computeListLayout(list).items, toItemWidgets),
];
