import { describe, expect, it } from 'vitest';

import { HUD_CONTROL_HEIGHT } from '../consts';
import type { HudButton } from '../types/hud-button';
import { toWidgetBottom } from './to-widget-bottom';

const BUTTON: HudButton = Object.freeze({
  kind: 'BUTTON',
  id: 'skip',
  page: '',
  row: 4,
  column: 6,
  width: 0,
  text: 'SKIP',
});

describe('toWidgetBottom', () => {
  it('should return the row under the widget when it measures where one ends', () => {
    expect(toWidgetBottom(BUTTON)).toBe(4 + HUD_CONTROL_HEIGHT);
  });

  it('should return the height of the widget when it sits at the top of the item', () => {
    expect(toWidgetBottom({ ...BUTTON, row: 0 })).toBe(HUD_CONTROL_HEIGHT);
  });
});
