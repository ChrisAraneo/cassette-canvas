import { HUD_CONTENT_LEFT } from '../consts';
import type { HudWidget } from '../types/hud-widget';

export const toLeft = (widget: HudWidget): number =>
  HUD_CONTENT_LEFT + widget.column;
