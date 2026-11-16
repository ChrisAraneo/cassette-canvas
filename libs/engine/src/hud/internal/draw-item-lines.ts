import { map } from 'lodash-es';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import {
  HUD_LIST_ITEM_HEIGHT,
  HUD_LIST_TEXT_LEFT,
  HUD_LIST_TEXT_TOP,
} from '../consts';
import type { HudList } from '../types/hud-list';
import type { HudTheme } from '../types/hud-theme';
import { sliceListText } from './slice-list-text';
import { toItemShade } from './to-item-shade';
import type { HudListPlacement } from './types/hud-list-placement';

export const drawItemLines = (
  placement: HudListPlacement,
  widget: HudList,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  map(placement.item.lines, (line, index) =>
    toTextPaint(
      sliceListText(line, placement.rect.width - 2 * HUD_LIST_TEXT_LEFT),
      toPixel(theme.color, toItemShade(placement, widget, theme)),
      placement.rect.row + HUD_LIST_TEXT_TOP + index * HUD_LIST_ITEM_HEIGHT,
      placement.rect.column + HUD_LIST_TEXT_LEFT,
    ),
  );
