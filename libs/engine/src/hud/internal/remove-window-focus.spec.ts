import { describe, expect, it } from 'vitest';

import { createHudTheme } from '../create-hud-theme';
import type { Hud } from '../types/hud';
import { removeWindowFocus } from './remove-window-focus';

const FOCUS = Object.freeze({ window: 'deck', widget: 'search' });

const createHud = (): Hud => ({
  theme: createHudTheme(),
  size: undefined,
  windows: [],
  grab: undefined,
  focus: FOCUS,
});

describe('removeWindowFocus', () => {
  it('should hold nothing when the focus is on the window it removes', () => {
    expect(removeWindowFocus(createHud(), 'deck')).toBeUndefined();
  });

  it('should keep the focus when it is on another window', () => {
    expect(removeWindowFocus(createHud(), 'mixer')).toEqual(FOCUS);
  });

  it('should hold nothing when nothing had the focus already', () => {
    expect(
      removeWindowFocus({ ...createHud(), focus: undefined }, 'deck'),
    ).toBeUndefined();
  });
});
