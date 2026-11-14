import { describe, expect, it } from 'vitest';

import { TEXT_HEIGHT } from '../../text/consts';
import {
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_CONTROL_HEIGHT,
  HUD_DIVIDER_HEIGHT,
} from '../consts';
import type { HudButton } from '../types/hud-button';
import type { HudLabel } from '../types/hud-label';
import { computeControlWidth } from './compute-control-width';
import { computeTextWidth } from './compute-text-width';
import { computeWidgetRect } from './compute-widget-rect';

const LABEL: HudLabel = Object.freeze({
  kind: 'label',
  id: 'fps',
  page: '',
  row: 4,
  column: 6,
  text: 'FPS 60',
});

const BUTTON: HudButton = Object.freeze({
  kind: 'button',
  id: 'skip',
  page: '',
  row: 4,
  column: 6,
  width: 0,
  text: 'SKIP',
});

describe('computeWidgetRect', () => {
  it('should return a rectangle measured from the top-left of the content when it measures a widget', () => {
    expect(computeWidgetRect(LABEL)).toMatchObject({
      row: HUD_CONTENT_TOP + 4,
      column: HUD_CONTENT_LEFT + 6,
    });
  });

  it('should return a label as wide and as tall as its letters when the widget is a label', () => {
    expect(computeWidgetRect(LABEL)).toMatchObject({
      width: computeTextWidth('FPS 60'),
      height: TEXT_HEIGHT,
    });
  });

  it('should return a button fitted to its text when it asks for no width', () => {
    expect(computeWidgetRect(BUTTON)).toMatchObject({
      width: computeControlWidth('SKIP'),
      height: HUD_CONTROL_HEIGHT,
    });
  });

  it('should return the width a button asks for when it has one', () => {
    expect(computeWidgetRect({ ...BUTTON, width: 40 }).width).toBe(40);
  });

  it('should return the width a field asks for when it has one', () => {
    expect(
      computeWidgetRect({
        kind: 'input',
        id: 'note',
        page: '',
        row: 0,
        column: 0,
        width: 60,
        text: '',
      }),
    ).toMatchObject({ width: 60, height: HUD_CONTROL_HEIGHT });
  });

  it('should return the size a panel asks for when the widget is a panel', () => {
    expect(
      computeWidgetRect({
        kind: 'panel',
        id: 'meters',
        page: '',
        row: 4,
        column: 6,
        width: 60,
        height: 20,
      }),
    ).toEqual({
      row: HUD_CONTENT_TOP + 4,
      column: HUD_CONTENT_LEFT + 6,
      width: 60,
      height: 20,
    });
  });

  it('should return a divider two rows tall when the widget is a divider', () => {
    expect(
      computeWidgetRect({
        kind: 'divider',
        id: 'line',
        page: '',
        row: 4,
        column: 6,
        width: 60,
      }),
    ).toEqual({
      row: HUD_CONTENT_TOP + 4,
      column: HUD_CONTENT_LEFT + 6,
      width: 60,
      height: HUD_DIVIDER_HEIGHT,
    });
  });

  it('should return the size a list asks for when the widget is a list', () => {
    expect(
      computeWidgetRect({
        kind: 'list',
        id: 'tracks',
        page: '',
        row: 4,
        column: 6,
        width: 80,
        height: 48,
        items: [],
        scroll: 0,
        selected: '',
      }),
    ).toEqual({
      row: HUD_CONTENT_TOP + 4,
      column: HUD_CONTENT_LEFT + 6,
      width: 80,
      height: 48,
    });
  });

  it('should return a tab strip as wide as its tabs together when the widget is a strip', () => {
    expect(
      computeWidgetRect({
        kind: 'tabs',
        id: 'tabs',
        page: '',
        row: 0,
        column: 0,
        tabs: [
          { id: 'scene', text: 'SCENE' },
          { id: 'light', text: 'LIGHT' },
        ],
      }).width,
    ).toBe(computeControlWidth('SCENE') + computeControlWidth('LIGHT'));
  });
});
