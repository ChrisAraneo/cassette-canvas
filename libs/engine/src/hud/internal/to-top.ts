import { HUD_CONTENT_TOP } from '../consts';
import type { HudWidget } from '../types/hud-widget';

export const toTop = (widget: HudWidget): number =>
  HUD_CONTENT_TOP + widget.row;
