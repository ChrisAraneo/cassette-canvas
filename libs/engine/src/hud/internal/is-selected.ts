import type { HudList } from '../types/hud-list';
import type { HudListPlacement } from './types/hud-list-placement';

export const isSelected = (
  placement: HudListPlacement,
  widget: HudList,
): boolean => placement.item.id === widget.selected;
