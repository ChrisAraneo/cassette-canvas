import { find } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import { toWindowWidgets } from './to-window-widgets';

const { nonNullable } = P;

/**
 * Returns a widget a window shows right now, by its id: one of the widgets
 * on its open page, or one that sits on an item a list shows, already moved
 * to where it sits in the window. Returns `undefined` when the window does
 * not show a widget with that id.
 */
export const findShownWidget = (
  hud: Hud,
  window: string,
  widget: string,
): HudWidget | undefined =>
  match(findHudWindow(hud, window))
    .with(
      nonNullable,
      (found) =>
        find(toWindowWidgets(found), (placed) => placed.widget.id === widget)
          ?.widget,
    )
    .otherwise(() => undefined);
