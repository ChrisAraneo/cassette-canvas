import { describe, expect, it } from 'vitest';

import { createHudTheme } from '../create-hud-theme';
import type { Hud } from '../types/hud';
import { removeWindowGrab } from './remove-window-grab';

const GRAB = Object.freeze({
  kind: 'PRESS',
  window: 'deck',
  widget: 'skip',
  row: 2,
  column: 4,
});

const createHud = (): Hud => ({
  theme: createHudTheme(),
  size: undefined,
  windows: [],
  grab: GRAB,
  focus: undefined,
});

describe('removeWindowGrab', () => {
  it('should hold nothing when the grab is on the window it removes', () => {
    expect(removeWindowGrab(createHud(), 'deck')).toBeUndefined();
  });

  it('should keep the grab when it is on another window', () => {
    expect(removeWindowGrab(createHud(), 'mixer')).toEqual(GRAB);
  });

  it('should hold nothing when the pointer held nothing already', () => {
    expect(
      removeWindowGrab({ ...createHud(), grab: undefined }, 'deck'),
    ).toBeUndefined();
  });
});
