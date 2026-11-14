import type { HudListItem } from '../../types/hud-list-item';
import type { HudRect } from '../../types/hud-rect';

/** One item a list shows right now, and the rectangle it takes. */
export interface HudListPlacement {
  readonly item: HudListItem;
  readonly rect: HudRect;
}
