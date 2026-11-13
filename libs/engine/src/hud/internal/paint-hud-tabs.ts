import { flatMap } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import {
  HUD_CONTENT_LEFT,
  HUD_LABEL_PADDING,
  HUD_TAB_DROP,
  HUD_TEXT_TOP,
} from '../consts';
import type { Hud } from '../types/hud';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import type { HudTabs } from '../types/hud-tabs';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';
import { computeContentWidth } from './compute-content-width';
import { computeTabRects } from './compute-tab-rects';
import { computeWidgetRect } from './compute-widget-rect';
import { paintBevel } from './paint-bevel';
import { toWindowTheme } from './to-window-theme';

const { nonNullable } = P;

const NO_PAINTS: readonly OverlayPaint[] = Object.freeze([]);

const paintTabText = (
  tab: HudTab,
  rect: HudRect,
  theme: HudTheme,
): OverlayPaint =>
  toTextPaint(
    tab.text,
    toPixel(theme.color, theme.text),
    rect.row + HUD_TEXT_TOP,
    rect.column + HUD_LABEL_PADDING,
  );

/**
 * Returns the paint steps for a tab that is not open: it sits lower and takes
 * the window's own shade.
 */
const paintClosedTab = (
  tab: HudTab,
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => [
  {
    pixel: toPixel(theme.color, theme.body),
    row: rect.row + HUD_TAB_DROP,
    column: rect.column,
    width: rect.width,
    height: rect.height - HUD_TAB_DROP,
  },
  ...paintBevel(
    {
      row: rect.row + HUD_TAB_DROP,
      column: rect.column,
      width: rect.width,
      height: rect.height - HUD_TAB_DROP,
    },
    toPixel(theme.color, theme.highlight),
    toPixel(theme.color, theme.shadow),
  ),
  paintTabText(tab, { ...rect, row: rect.row + HUD_TAB_DROP }, theme),
];

/**
 * Returns the paint steps for the open tab. It has no bevel along its
 * bottom, so it joins the page below it.
 */
const paintOpenTab = (
  tab: HudTab,
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => [
  { pixel: toPixel(theme.color, theme.face), ...rect },
  {
    pixel: toPixel(theme.color, theme.highlight),
    row: rect.row,
    column: rect.column,
    width: rect.width,
    height: 1,
  },
  {
    pixel: toPixel(theme.color, theme.highlight),
    row: rect.row,
    column: rect.column,
    width: 1,
    height: rect.height,
  },
  {
    pixel: toPixel(theme.color, theme.shadow),
    row: rect.row,
    column: rect.column + rect.width - 1,
    width: 1,
    height: rect.height,
  },
  paintTabText(tab, rect, theme),
];

/**
 * Returns the paint steps for a strip of tabs, with a line across the window
 * that joins the open tab to the page below it. The closed tabs are painted
 * first and the open one last, so it covers that line and looks like the
 * front tab.
 */
export const paintHudTabs = (
  hud: Hud,
  window: HudWindow,
  widget: HudTabs,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const strip = computeWidgetRect(widget);
  const rects = computeTabRects(widget);

  return [
    ...flatMap(widget.tabs, (tab, index) =>
      match({ rect: rects[index], open: tab.id === window.page })
        .with({ rect: nonNullable, open: false }, ({ rect }) =>
          paintClosedTab(tab, rect, theme),
        )
        .otherwise(() => NO_PAINTS),
    ),
    {
      pixel: toPixel(theme.color, theme.highlight),
      row: strip.row + strip.height - 1,
      column: HUD_CONTENT_LEFT,
      width: computeContentWidth(window),
      height: 1,
    },
    ...flatMap(widget.tabs, (tab, index) =>
      match({ rect: rects[index], open: tab.id === window.page })
        .with({ rect: nonNullable, open: true }, ({ rect }) =>
          paintOpenTab(tab, rect, theme),
        )
        .otherwise(() => NO_PAINTS),
    ),
  ];
};
