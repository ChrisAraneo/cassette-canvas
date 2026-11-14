import { last, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { toPixel } from '../../palette/to-pixel';
import { createHud } from '../create-hud';
import { HUD_CARET_HEIGHT, HUD_CARET_WIDTH } from '../consts';
import type { Hud } from '../types/hud';
import type { HudInput } from '../types/hud-input';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { paintHudInput } from './paint-hud-input';

const INPUT: HudInput = Object.freeze({
  kind: 'input',
  id: 'note',
  page: '',
  row: 0,
  column: 0,
  width: 60,
  text: 'HI',
});

const WINDOW: HudWindow = Object.freeze({
  id: 'notes',
  title: 'NOTES',
  row: 0,
  column: 0,
  width: 90,
  height: 40,
  color: 15,
  closable: true,
  page: '',
  widgets: [INPUT],
});

const THEME = createHud().theme;

const createTypingHud = (): Hud => ({
  ...createHud(),
  focus: { window: 'notes', widget: 'note' },
});

describe('paintHudInput', () => {
  it('should return the field filled with the lightest shade, like paper, when it paints one', () => {
    expect(paintHudInput(createHud(), WINDOW, INPUT)[0]).toEqual({
      pixel: toPixel(15, THEME.highlight),
      ...computeWidgetRect(INPUT),
    });
  });

  it('should return a dark line around the field when it paints one', () => {
    expect(paintHudInput(createHud(), WINDOW, INPUT)[1]).toMatchObject({
      pixel: toPixel(15, THEME.edge),
    });
  });

  it('should return a shadow along the top of the field when it paints one', () => {
    expect(paintHudInput(createHud(), WINDOW, INPUT)[5]).toMatchObject({
      pixel: toPixel(15, THEME.shadow),
      height: 1,
    });
  });

  it('should return a caret when the field takes the keys', () => {
    expect(last(paintHudInput(createTypingHud(), WINDOW, INPUT))).toMatchObject(
      {
        pixel: toPixel(15, THEME.text),
        width: HUD_CARET_WIDTH,
        height: HUD_CARET_HEIGHT,
      },
    );
  });

  it('should return no caret when the field does not take the keys', () => {
    expect(last(paintHudInput(createHud(), WINDOW, INPUT))).toMatchObject({
      pixel: TRANSPARENT,
    });
  });

  it('should return the same number of paint steps when the field takes the keys and when it does not', () => {
    expect(size(paintHudInput(createTypingHud(), WINDOW, INPUT))).toBe(
      size(paintHudInput(createHud(), WINDOW, INPUT)),
    );
  });
});
