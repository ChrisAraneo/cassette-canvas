import type { HudRect } from '../../types/hud-rect';
import type { HudListPlacement } from './hud-list-placement';

/**
 * Where everything in a list sits, measured from the window's top-left
 * pixel: how many items it shows at once, which item it starts at, the item
 * the last page starts at, the items it shows with the rectangle each one
 * takes, the two arrows of its scroll bar, the track between them, and the
 * thumb on that track.
 */
export interface HudListLayout {
  readonly capacity: number;
  readonly scroll: number;
  readonly lastPage: number;
  readonly items: readonly HudListPlacement[];
  readonly up: HudRect;
  readonly down: HudRect;
  readonly track: HudRect;
  readonly thumb: HudRect;
}
