import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { HudList } from '../types/hud-list';
import type { HudTheme } from '../types/hud-theme';
import { drawItemDivider } from './draw-item-divider';
import { drawItemLines } from './draw-item-lines';
import { drawSelection } from './draw-selection';
import type { HudListPlacement } from './types/hud-list-placement';

export const drawItem = (
  placement: HudListPlacement,
  index: number,
  count: number,
  widget: HudList,
  theme: HudTheme,
): readonly OverlayPaint[] => [
  ...drawSelection(placement, widget, theme),
  ...drawItemLines(placement, widget, theme),
  ...drawItemDivider(placement, index, count, theme),
];
