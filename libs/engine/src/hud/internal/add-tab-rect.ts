import { last } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { HUD_CONTROL_HEIGHT } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import { computeControlWidth } from './compute-control-width';

const { nonNullable } = P;

export const addTabRect = (
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
