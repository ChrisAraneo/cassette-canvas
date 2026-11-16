import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudWindow } from '../types/hud-window';
import { handleWidgetPress } from './handle-widget-press';
import { toIdleChange } from './to-idle-change';
import type { HudHit } from './types/hud-hit';

export const handleWindowPart = (
  hud: Hud,
  window: HudWindow,
  hit: HudHit,
  row: number,
  column: number,
): HudChange =>
  match(hit.part)
    .with('CLOSE', (): HudChange => ({
      hud: {
        ...hud,
        focus: undefined,
        grab: {
          kind: 'CLOSE',
          window: window.id,
          widget: '',
          row,
          column,
        },
      },
      actions: [],
    }))
    .with('TITLE', (): HudChange => ({
      hud: {
        ...hud,
        focus: undefined,
        grab: {
          kind: 'DRAG',
          window: window.id,
          widget: '',
          row,
          column,
        },
      },
      actions: [],
    }))
    .with('WIDGET', () => handleWidgetPress(hud, hit, row, column))
    .otherwise(() => toIdleChange(hud));
