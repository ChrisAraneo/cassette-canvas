import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { drawHudButton } from './draw-hud-button';
import { drawHudDivider } from './draw-hud-divider';
import { drawHudInput } from './draw-hud-input';
import { drawHudLabel } from './draw-hud-label';
import { drawHudList } from './draw-hud-list';
import { drawHudPanel } from './draw-hud-panel';
import { drawHudTabs } from './draw-hud-tabs';

/** Returns the paint steps for one widget, by its kind. */
export const drawHudWidget = (
  hud: Hud,
  window: HudWindow,
  widget: HudWidget,
): readonly OverlayPaint[] =>
  match(widget)
    .with({ kind: 'LABEL' }, (label) => drawHudLabel(hud, window, label))
    .with({ kind: 'BUTTON' }, (button) => drawHudButton(hud, window, button))
    .with({ kind: 'INPUT' }, (input) => drawHudInput(hud, window, input))
    .with({ kind: 'TABS' }, (tabs) => drawHudTabs(hud, window, tabs))
    .with({ kind: 'PANEL' }, (panel) => drawHudPanel(hud, window, panel))
    .with({ kind: 'DIVIDER' }, (divider) =>
      drawHudDivider(hud, window, divider),
    )
    .with({ kind: 'LIST' }, (list) => drawHudList(hud, window, list))
    .exhaustive();
