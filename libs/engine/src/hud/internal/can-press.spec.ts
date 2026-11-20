import { describe, expect, it } from 'vitest';

import type { HudButton } from '../types/hud-button';
import type { HudLabel } from '../types/hud-label';
import { canPress } from './can-press';

const BUTTON: HudButton = Object.freeze({
  kind: 'BUTTON',
  id: 'skip',
  page: '',
  row: 0,
  column: 0,
  width: 0,
  text: 'SKIP',
});

const LABEL: HudLabel = Object.freeze({
  kind: 'LABEL',
  id: 'fps',
  page: '',
  row: 0,
  column: 0,
  text: 'FPS 60',
});

describe('canPress', () => {
  it('should hold when the widget sits in the window itself', () => {
    expect(canPress({ widget: LABEL, item: '' })).toBe(true);
  });

  it('should hold when the widget is a button on an item of a list', () => {
    expect(canPress({ widget: BUTTON, item: 'track-1' })).toBe(true);
  });

  it('should not hold when the widget sits on an item and is not a button', () => {
    expect(canPress({ widget: LABEL, item: 'track-1' })).toBe(false);
  });
});
