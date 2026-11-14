import { slice } from 'lodash-es';
import type { HudList } from '../types/hud-list';
import { computeListRoom } from './compute-list-room';
import { countFittingItems } from './count-fitting-items';

/**
 * Returns how many items a list shows at once, counting from `scroll`: as
 * many as the room it leaves holds, each one as tall as it asks to be, with
 * a divider between each two of them.
 */
export const computeListCapacity = (widget: HudList, scroll: number): number =>
  countFittingItems(slice(widget.items, scroll), computeListRoom(widget));
