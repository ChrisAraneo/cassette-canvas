import { find } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { findHudWindow } from './find-hud-window';
import type { Hud } from './types/hud';
import type { HudWidget } from './types/hud-widget';

const { nonNullable } = P;

/**
 * Returns a widget of a window, or `undefined` if neither the window nor the
 * widget is there.
 */
export const findHudWidget = (
  hud: Hud,
  window: string,
  widget: string,
): HudWidget | undefined =>
  match(findHudWindow(hud, window))
    .with(nonNullable, (found) =>
      find(found.widgets, (placed) => placed.id === widget),
    )
    .otherwise(() => undefined);
