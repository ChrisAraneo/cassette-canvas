import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { paintHudButton } from './paint-hud-button';
import { paintHudDivider } from './paint-hud-divider';
import { paintHudInput } from './paint-hud-input';
import { paintHudLabel } from './paint-hud-label';
import { paintHudList } from './paint-hud-list';
import { paintHudPanel } from './paint-hud-panel';
import { paintHudTabs } from './paint-hud-tabs';

/** Returns the paint steps for one widget, by its kind. */
export const paintHudWidget = (
  hud: Hud,
  window: HudWindow,
  widget: HudWidget,
): readonly OverlayPaint[] =>
  match(widget)
    .with({ kind: 'label' }, (label) => paintHudLabel(hud, window, label))
    .with({ kind: 'button' }, (button) => paintHudButton(hud, window, button))
    .with({ kind: 'input' }, (input) => paintHudInput(hud, window, input))
    .with({ kind: 'tabs' }, (tabs) => paintHudTabs(hud, window, tabs))
    .with({ kind: 'panel' }, (panel) => paintHudPanel(hud, window, panel))
    .with({ kind: 'divider' }, (divider) =>
      paintHudDivider(hud, window, divider),
    )
    .with({ kind: 'list' }, (list) => paintHudList(hud, window, list))
    .exhaustive();
