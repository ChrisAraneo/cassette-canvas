import { flatMap, floor, map, max, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { toOverlay } from '../../overlay/to-overlay';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { TEXT_INK } from '../../text/consts';
import { toTextPaint } from '../../text/to-text-paint';
import {
  HUD_DIVIDER_HEIGHT,
  HUD_DOWN_ART,
  HUD_LIST_ITEM_HEIGHT,
  HUD_LIST_TEXT_LEFT,
  HUD_LIST_TEXT_TOP,
  HUD_UP_ART,
} from '../consts';
import type { Hud } from '../types/hud';
import type { HudList } from '../types/hud-list';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';
import { computeListLayout } from './compute-list-layout';
import { computeWidgetRect } from './compute-widget-rect';
import { isScrolling } from './is-scrolling';
import { paintBevel } from './paint-bevel';
import { paintGroove } from './paint-groove';
import { paintSunken } from './paint-sunken';
import { toListText } from './to-list-text';
import type { HudListLayout } from './types/hud-list-layout';
import type { HudListPlacement } from './types/hud-list-placement';
import { toWindowTheme } from './to-window-theme';

const NO_PAINTS: readonly OverlayPaint[] = Object.freeze([]);

const toArtWidth = (art: readonly string[]): number => max(map(art, size)) ?? 0;

const isSelected = (placement: HudListPlacement, widget: HudList): boolean =>
  placement.item.id === widget.selected;

/** The selected item is drawn inverted: light letters on a dark row. */
const paintSelection = (
  placement: HudListPlacement,
  widget: HudList,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  match(isSelected(placement, widget))
    .with(true, (): readonly OverlayPaint[] => [
      { pixel: toPixel(theme.color, theme.shadow), ...placement.rect },
    ])
    .otherwise(() => NO_PAINTS);

const toItemShade = (
  placement: HudListPlacement,
  widget: HudList,
  theme: HudTheme,
): number =>
  match(isSelected(placement, widget))
    .with(true, () => theme.highlight)
    .otherwise(() => theme.text);

/**
 * The lines of an item, one under the other, each one cut off where the item
 * ends.
 */
const paintItemLines = (
  placement: HudListPlacement,
  widget: HudList,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  map(placement.item.lines, (line, index) =>
    toTextPaint(
      toListText(line, placement.rect.width - 2 * HUD_LIST_TEXT_LEFT),
      toPixel(theme.color, toItemShade(placement, widget, theme)),
      placement.rect.row + HUD_LIST_TEXT_TOP + index * HUD_LIST_ITEM_HEIGHT,
      placement.rect.column + HUD_LIST_TEXT_LEFT,
    ),
  );

/** Every item but the last one it shows has a divider under it. */
const paintItemDivider = (
  placement: HudListPlacement,
  index: number,
  count: number,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  match(index < count - 1)
    .with(true, () =>
      paintGroove(
        {
          ...placement.rect,
          row: placement.rect.row + placement.rect.height,
          height: HUD_DIVIDER_HEIGHT,
        },
        toPixel(theme.color, theme.shadow),
        toPixel(theme.color, theme.highlight),
      ),
    )
    .otherwise(() => NO_PAINTS);

const paintItem = (
  placement: HudListPlacement,
  index: number,
  count: number,
  widget: HudList,
  theme: HudTheme,
): readonly OverlayPaint[] => [
  ...paintSelection(placement, widget, theme),
  ...paintItemLines(placement, widget, theme),
  ...paintItemDivider(placement, index, count, theme),
];

/** An arrow at one end of the scroll bar: a raised square with a triangle. */
const paintArrow = (
  rect: HudRect,
  art: readonly string[],
  theme: HudTheme,
): readonly OverlayPaint[] => [
  { pixel: toPixel(theme.color, theme.face), ...rect },
  ...paintBevel(
    rect,
    toPixel(theme.color, theme.highlight),
    toPixel(theme.color, theme.shadow),
  ),
  {
    image: toOverlay(art, { [TEXT_INK]: toPixel(theme.color, theme.text) }),
    row: rect.row + floor((rect.height - size(art)) / 2),
    column: rect.column + floor((rect.width - toArtWidth(art)) / 2),
  },
];

/** The thumb swaps the sides of its bevel while the pointer drags it. */
const paintThumb = (
  layout: HudListLayout,
  theme: HudTheme,
  held: boolean,
): readonly OverlayPaint[] =>
  match(held)
    .with(true, () =>
      paintBevel(
        layout.thumb,
        toPixel(theme.color, theme.shadow),
        toPixel(theme.color, theme.highlight),
      ),
    )
    .otherwise(() =>
      paintBevel(
        layout.thumb,
        toPixel(theme.color, theme.highlight),
        toPixel(theme.color, theme.shadow),
      ),
    );

/** The track the thumb runs down, and the thumb that shows how far it is. */
const paintBar = (
  layout: HudListLayout,
  theme: HudTheme,
  held: boolean,
): readonly OverlayPaint[] => [
  { pixel: toPixel(theme.color, theme.body), ...layout.track },
  { pixel: toPixel(theme.color, theme.face), ...layout.thumb },
  ...paintThumb(layout, theme, held),
  ...paintArrow(layout.up, HUD_UP_ART, theme),
  ...paintArrow(layout.down, HUD_DOWN_ART, theme),
];

/**
 * Returns the paint steps for a list: a surface sunk into the window, the
 * items it shows with a divider between each two, and the scroll bar down
 * its right side. An item shows its lines of text one under the other, each
 * one cut off where the item ends, and the selected item is drawn inverted.
 * The widgets that sit on the items are painted after the list itself, so
 * they come out on top of it.
 */
export const paintHudList = (
  hud: Hud,
  window: HudWindow,
  widget: HudList,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const layout = computeListLayout(widget);

  return [
    ...paintSunken(computeWidgetRect(widget), theme),
    ...flatMap(layout.items, (placement, index) =>
      paintItem(placement, index, size(layout.items), widget, theme),
    ),
    ...paintBar(layout, theme, isScrolling(hud, window.id, widget.id)),
  ];
};
