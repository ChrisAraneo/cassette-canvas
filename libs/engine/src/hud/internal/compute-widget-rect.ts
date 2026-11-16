import { sumBy } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { TEXT_HEIGHT } from '../../text/consts';
import { HUD_CONTROL_HEIGHT, HUD_DIVIDER_HEIGHT } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudWidget } from '../types/hud-widget';
import { computeControlWidth } from './compute-control-width';
import { computeTabRects } from './compute-tab-rects';
import { computeTextWidth } from './compute-text-width';
import { toLeft } from './to-left';
import { toTop } from './to-top';

const { number, union } = P;

/**
 * Returns where a widget sits, measured from the window's top-left pixel. A
 * button of width 0 is as wide as its text needs, a label is as wide and as
 * tall as its letters, a tab strip is as wide as its tabs together, and a
 * panel, a divider, and a list take the size they are given.
 */
export const computeWidgetRect = (widget: HudWidget): HudRect =>
  match(widget)
    .with({ kind: 'LABEL' }, (label) => ({
      row: toTop(label),
      column: toLeft(label),
      width: computeTextWidth(label.text),
      height: TEXT_HEIGHT,
    }))
    .with({ kind: 'BUTTON', width: number.gt(0) }, (button) => ({
      row: toTop(button),
      column: toLeft(button),
      width: button.width,
      height: HUD_CONTROL_HEIGHT,
    }))
    .with({ kind: 'BUTTON' }, (button) => ({
      row: toTop(button),
      column: toLeft(button),
      width: computeControlWidth(button.text),
      height: HUD_CONTROL_HEIGHT,
    }))
    .with({ kind: 'INPUT' }, (input) => ({
      row: toTop(input),
      column: toLeft(input),
      width: input.width,
      height: HUD_CONTROL_HEIGHT,
    }))
    .with({ kind: 'TABS' }, (tabs) => ({
      row: toTop(tabs),
      column: toLeft(tabs),
      width: sumBy(computeTabRects(tabs), (rect) => rect.width),
      height: HUD_CONTROL_HEIGHT,
    }))
    .with({ kind: 'DIVIDER' }, (divider) => ({
      row: toTop(divider),
      column: toLeft(divider),
      width: divider.width,
      height: HUD_DIVIDER_HEIGHT,
    }))
    .with(union({ kind: 'PANEL' }, { kind: 'LIST' }), (surface) => ({
      row: toTop(surface),
      column: toLeft(surface),
      width: surface.width,
      height: surface.height,
    }))
    .exhaustive();
