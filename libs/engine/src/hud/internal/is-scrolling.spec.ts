import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import { isScrolling } from './is-scrolling';

const createScrollingHud = (): Hud => ({
  ...createHud(),
  grab: {
    kind: 'scroll',
    window: 'tape',
    widget: 'tracks',
    row: 2,
    column: 4,
  },
});

describe('isScrolling', () => {
  it('should return true when the pointer holds the thumb of the list', () => {
    expect(isScrolling(createScrollingHud(), 'tape', 'tracks')).toBe(true);
  });

  it('should return false when the widget is another one of the same window', () => {
    expect(isScrolling(createScrollingHud(), 'tape', 'sides')).toBe(false);
  });

  it('should return false when the widget belongs to another window', () => {
    expect(isScrolling(createScrollingHud(), 'deck', 'tracks')).toBe(false);
  });

  it('should return false when the pointer holds the list as a button', () => {
    expect(
      isScrolling(
        {
          ...createHud(),
          grab: {
            kind: 'press',
            window: 'tape',
            widget: 'tracks',
            row: 0,
            column: 0,
          },
        },
        'tape',
        'tracks',
      ),
    ).toBe(false);
  });

  it('should return false when the pointer holds nothing', () => {
    expect(isScrolling(createHud(), 'tape', 'tracks')).toBe(false);
  });
});
