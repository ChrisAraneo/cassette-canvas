import { sumBy } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { TEXT_HEIGHT } from '../../text/consts';
import {
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_CONTROL_HEIGHT,
  HUD_DIVIDER_HEIGHT,
} from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudWidget } from '../types/hud-widget';
import { computeControlWidth } from './compute-control-width';
import { computeTabRects } from './compute-tab-rects';
import { computeTextWidth } from './compute-text-width';

const { number, union } = P;

const toTop = (widget: HudWidget): number => HUD_CONTENT_TOP + widget.row;

const toLeft = (widget: HudWidget): number => HUD_CONTENT_LEFT + widget.column;

/**
 * Returns where a widget sits, measured from the window's top-left pixel. A
 * button of width 0 is as wide as its text needs, a label is as wide and as
 * tall as its letters, a tab strip is as wide as its tabs together, and a
 * panel, a divider, and a list take the size they are given.
 */
export const computeWidgetRect = (widget: HudWidget): HudRect =>
  match(widget)
    .with({ kind: 'label' }, (label) => ({
      row: toTop(label),
      column: toLeft(label),
      width: computeTextWidth(label.text),
      height: TEXT_HEIGHT,
    }))
    .with({ kind: 'button', width: number.gt(0) }, (button) => ({
      row: toTop(button),
      column: toLeft(button),
      width: button.width,
      height: HUD_CONTROL_HEIGHT,
    }))
    .with({ kind: 'button' }, (button) => ({
      row: toTop(button),
      column: toLeft(button),
      width: computeControlWidth(button.text),
      height: HUD_CONTROL_HEIGHT,
    }))
    .with({ kind: 'input' }, (input) => ({
      row: toTop(input),
      column: toLeft(input),
      width: input.width,
      height: HUD_CONTROL_HEIGHT,
    }))
    .with({ kind: 'tabs' }, (tabs) => ({
      row: toTop(tabs),
      column: toLeft(tabs),
      width: sumBy(computeTabRects(tabs), 'width'),
      height: HUD_CONTROL_HEIGHT,
    }))
    .with({ kind: 'divider' }, (divider) => ({
      row: toTop(divider),
      column: toLeft(divider),
      width: divider.width,
      height: HUD_DIVIDER_HEIGHT,
    }))
    .with(union({ kind: 'panel' }, { kind: 'list' }), (surface) => ({
      row: toTop(surface),
      column: toLeft(surface),
      width: surface.width,
      height: surface.height,
    }))
    .exhaustive();
