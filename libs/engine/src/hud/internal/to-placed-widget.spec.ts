import { describe, expect, it } from 'vitest';

import { HUD_CONTENT_LEFT, HUD_CONTENT_TOP } from '../consts';
import type { HudButton } from '../types/hud-button';
import type { HudRect } from '../types/hud-rect';
import { toPlacedWidget } from './to-placed-widget';

const BUTTON: HudButton = Object.freeze({
  kind: 'BUTTON',
  id: 'play',
  page: '',
  row: 1,
  column: 2,
  width: 0,
  text: 'PLAY',
});

const RECT: HudRect = Object.freeze({
  row: 40,
  column: 12,
  width: 60,
  height: 9,
});

describe('toPlacedWidget', () => {
  it('should move the widget to where the item sits in the window when it places one', () => {
    expect(toPlacedWidget(BUTTON, RECT)).toMatchObject({
      row: 1 + 40 - HUD_CONTENT_TOP,
      column: 2 + 12 - HUD_CONTENT_LEFT,
    });
  });

  it('should keep everything else about the widget when it places one', () => {
    expect(toPlacedWidget(BUTTON, RECT)).toMatchObject({
      kind: 'BUTTON',
      id: 'play',
      text: 'PLAY',
    });
  });

  it('should place the widget where the content starts when the item sits there', () => {
    expect(
      toPlacedWidget(
        { ...BUTTON, row: 0, column: 0 },
        { ...RECT, row: HUD_CONTENT_TOP, column: HUD_CONTENT_LEFT },
      ),
    ).toMatchObject({ row: 0, column: 0 });
  });

  it('should not change the widget it was given when it places one', () => {
    expect(toPlacedWidget(BUTTON, RECT)).not.toBe(BUTTON);
    expect(BUTTON.row).toBe(1);
  });
});
