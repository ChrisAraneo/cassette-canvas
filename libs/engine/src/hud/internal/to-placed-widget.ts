import { HUD_CONTENT_LEFT, HUD_CONTENT_TOP } from '../consts';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudRect } from '../types/hud-rect';
import type { HudWidget } from '../types/hud-widget';

export const toPlacedWidget = (
  widget: HudItemWidget,
  rect: HudRect,
): HudWidget => ({
  ...widget,
  row: widget.row + rect.row - HUD_CONTENT_TOP,
  column: widget.column + rect.column - HUD_CONTENT_LEFT,
});
