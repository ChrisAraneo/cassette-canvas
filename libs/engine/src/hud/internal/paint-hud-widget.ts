import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { paintHudButton } from './paint-hud-button';
import { paintHudInput } from './paint-hud-input';
import { paintHudLabel } from './paint-hud-label';
import { paintHudTabs } from './paint-hud-tabs';

/** One widget, drawn the way its kind asks for. */
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
    .exhaustive();
