import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudList } from '../types/hud-list';
import { computeListLayout } from './compute-list-layout';
import { toGrabbed } from './to-grabbed';
import { toIdleChange } from './to-idle-change';
import { toListPress } from './to-list-press';
import { toListScrolled } from './to-list-scrolled';
import { toSelected } from './to-selected';

const { nonNullable } = P;

/**
 * Handles a pointer press on a list: an arrow scrolls it one item, the thumb
 * on the scroll bar is taken hold of so a move can drag it, an item that is
 * selectable selects itself and returns a `SELECT` action, and a press
 * anywhere else in it does nothing. `row` and `column` are measured from the
 * window's top-left pixel.
 */
export const handleListPress = (
  hud: Hud,
  window: string,
  widget: HudList,
  row: number,
  column: number,
): HudChange =>
  pipe(
    computeListLayout(widget),
    (layout) => ({ layout, press: toListPress(layout, row, column) }),
    ({ layout, press }) =>
      match(press)
        .with({ up: true }, () =>
          toListScrolled(hud, window, widget, layout.scroll - 1),
        )
        .with({ down: true }, () =>
          toListScrolled(hud, window, widget, layout.scroll + 1),
        )
        .with({ thumb: true }, () =>
          toGrabbed(hud, window, widget, layout, row, column),
        )
        .with({ item: nonNullable }, ({ item }) =>
          toSelected(hud, window, widget, item),
        )
        .otherwise(() => toIdleChange(hud)),
  );
