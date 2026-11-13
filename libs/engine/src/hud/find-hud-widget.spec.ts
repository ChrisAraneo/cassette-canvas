import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { createHud } from './create-hud';
import { findHudWidget } from './find-hud-widget';
import type { Hud } from './types/hud';
import type { HudWidget } from './types/hud-widget';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  { kind: 'label', id: 'fps', page: '', row: 0, column: 0, text: 'FPS 60' },
]);

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 0,
    column: 0,
    width: 90,
    height: 76,
    widgets: WIDGETS,
  });

describe('findHudWidget', () => {
  it('should give the widget with the id', () => {
    expect(findHudWidget(createStreetHud(), 'street', 'fps')).toMatchObject({
      text: 'FPS 60',
    });
  });

  it('should give nothing when the window holds no such widget', () => {
    expect(findHudWidget(createStreetHud(), 'street', 'ghost')).toBeUndefined();
  });

  it('should give nothing when there is no such window', () => {
    expect(findHudWidget(createStreetHud(), 'ghost', 'fps')).toBeUndefined();
  });
});
