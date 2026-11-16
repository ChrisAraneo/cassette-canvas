import { describe, expect, it } from 'vitest';

import { createHudTheme } from '../create-hud-theme';
import type { Hud } from '../types/hud';
import { removeHudGrab } from './remove-hud-grab';

const createHud = (): Hud => ({
  theme: createHudTheme(),
  size: undefined,
  windows: [],
  grab: { kind: 'PRESS', window: 'deck', widget: 'skip', row: 2, column: 4 },
  focus: { window: 'deck', widget: 'search' },
});

describe('removeHudGrab', () => {
  it('should hold nothing when it drops the grab', () => {
    expect(removeHudGrab(createHud()).grab).toBeUndefined();
  });

  it('should keep the focus where it is when it drops the grab', () => {
    expect(removeHudGrab(createHud()).focus).toEqual({
      window: 'deck',
      widget: 'search',
    });
  });

  it('should hold nothing when the pointer held nothing already', () => {
    expect(
      removeHudGrab({ ...createHud(), grab: undefined }).grab,
    ).toBeUndefined();
  });

  it('should not change the old HUD when it drops the grab', () => {
    const hud = createHud();

    removeHudGrab(hud);

    expect(hud).toEqual(createHud());
  });
});
