import { match, P } from 'ts-pattern';
import { patchHudWindow } from '../patch-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudTabs } from '../types/hud-tabs';
import { findTab } from './find-tab';

const { nonNullable } = P;

export const patchHudPage = (
  hud: Hud,
  window: string,
  widget: HudTabs,
  row: number,
  column: number,
): HudChange =>
  match(findTab(widget, row, column))
    .with(nonNullable, (tab): HudChange => ({
      hud: {
        ...patchHudWindow(hud, window, { page: tab.id }),
        grab: undefined,
        focus: undefined,
      },
      actions: [{ kind: 'TAB', window, widget: widget.id, value: tab.id }],
    }))
    .otherwise((): HudChange => ({ hud, actions: [] }));
