import { describe, expect, it } from 'vitest';

import { createHudTheme } from '../create-hud-theme';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { isClosing } from './is-closing';

const WINDOW: HudWindow = Object.freeze({
  id: 'deck',
  title: 'DECK',
  row: 0,
  column: 0,
  width: 120,
  height: 80,
  color: 15,
  closable: true,
  page: '',
  widgets: [],
});

const HUD: Hud = Object.freeze({
  theme: createHudTheme(),
  size: undefined,
  windows: [WINDOW],
  grab: undefined,
  focus: undefined,
});

const CLOSE_GRAB = Object.freeze({
  kind: 'CLOSE',
  window: 'deck',
  widget: '',
  row: 0,
  column: 0,
});

describe('isClosing', () => {
  it('should hold when the pointer holds the close box of the window', () => {
    expect(isClosing({ ...HUD, grab: CLOSE_GRAB }, WINDOW)).toBe(true);
  });

  it('should not hold when the pointer holds nothing at all', () => {
    expect(isClosing(HUD, WINDOW)).toBe(false);
  });

  it('should not hold when the pointer holds the close box of another window', () => {
    expect(
      isClosing({ ...HUD, grab: { ...CLOSE_GRAB, window: 'mixer' } }, WINDOW),
    ).toBe(false);
  });

  it('should not hold when the pointer drags the title bar of the window', () => {
    expect(
      isClosing({ ...HUD, grab: { ...CLOSE_GRAB, kind: 'DRAG' } }, WINDOW),
    ).toBe(false);
  });
});
