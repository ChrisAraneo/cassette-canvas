import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import { isHeld } from './is-held';

const createPressingHud = (): Hud => ({
  ...createHud(),
  grab: {
    kind: 'press',
    window: 'street',
    widget: 'skip',
    row: 0,
    column: 0,
  },
});

describe('isHeld', () => {
  it('should return true when the pointer holds the button', () => {
    expect(isHeld(createPressingHud(), 'street', 'skip')).toBe(true);
  });

  it('should return false when the widget is another one of the same window', () => {
    expect(isHeld(createPressingHud(), 'street', 'hold')).toBe(false);
  });

  it('should return false when the widget belongs to another window', () => {
    expect(isHeld(createPressingHud(), 'notes', 'skip')).toBe(false);
  });

  it('should return false when a window is being dragged', () => {
    expect(
      isHeld(
        {
          ...createHud(),
          grab: {
            kind: 'drag',
            window: 'street',
            widget: 'skip',
            row: 0,
            column: 0,
          },
        },
        'street',
        'skip',
      ),
    ).toBe(false);
  });

  it('should return false when the pointer holds nothing', () => {
    expect(isHeld(createHud(), 'street', 'skip')).toBe(false);
  });
});
