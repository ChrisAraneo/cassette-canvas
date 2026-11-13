import { last, reduce } from 'lodash-es';
import { match, P } from 'ts-pattern';
import {
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_CONTROL_HEIGHT,
} from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import type { HudTabs } from '../types/hud-tabs';
import { computeControlWidth } from './compute-control-width';

const { nonNullable } = P;

const START: readonly HudRect[] = Object.freeze([]);

const addTabRect = (
  rects: readonly HudRect[],
  tab: HudTab,
  row: number,
  column: number,
): readonly HudRect[] => [
  ...rects,
  {
    row,
    column: match(last(rects))
      .with(nonNullable, (rect) => rect.column + rect.width)
      .otherwise(() => column),
    width: computeControlWidth(tab.text),
    height: HUD_CONTROL_HEIGHT,
  },
];

/**
 * Where each tab of a strip sits, measured from the window's top-left pixel.
 * Tabs sit side by side, each as wide as its own text.
 */
export const computeTabRects = (widget: HudTabs): readonly HudRect[] =>
  reduce(
    widget.tabs,
    (rects: readonly HudRect[], tab: HudTab) =>
      addTabRect(
        rects,
        tab,
        HUD_CONTENT_TOP + widget.row,
        HUD_CONTENT_LEFT + widget.column,
      ),
    START,
  );
