import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudList } from '../types/hud-list';
import type { HudListLayout } from './types/hud-list-layout';

export const toGrabbed = (
  hud: Hud,
  window: string,
  widget: HudList,
  layout: HudListLayout,
  row: number,
  column: number,
): HudChange => ({
  hud: {
    ...hud,
    focus: undefined,
    grab: {
      kind: 'SCROLL',
      window,
      widget: widget.id,
      row: row - layout.thumb.row,
      column: column - layout.thumb.column,
    },
  },
  actions: [],
});
