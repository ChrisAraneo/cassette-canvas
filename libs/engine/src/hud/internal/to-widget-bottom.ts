import type { HudItemWidget } from '../types/hud-item-widget';
import { computeWidgetRect } from './compute-widget-rect';

export const toWidgetBottom = (widget: HudItemWidget): number =>
  widget.row + computeWidgetRect(widget).height;
