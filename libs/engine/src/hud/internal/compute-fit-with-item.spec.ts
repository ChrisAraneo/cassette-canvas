import { describe, expect, it } from 'vitest';

import { computeFitWithItem } from './compute-fit-with-item';
import type { HudListItemFit } from './types/hud-list-item-fit';

const ROOM = 30;

const PITCH = 11;

const createFit = (): HudListItemFit => ({ count: 0, used: 0, full: false });

describe('computeFitWithItem', () => {
  it('should count the item in when it still fits in the room', () => {
    expect(computeFitWithItem(createFit(), PITCH, ROOM)).toEqual({
      count: 1,
      used: PITCH,
      full: false,
    });
  });

  it('should fill the page up when the item no longer fits in the room', () => {
    expect(
      computeFitWithItem({ count: 2, used: 28, full: false }, PITCH, ROOM),
    ).toEqual({ count: 2, used: 28, full: true });
  });

  it('should count nothing more in once the page is full', () => {
    expect(
      computeFitWithItem({ count: 2, used: 22, full: true }, PITCH, ROOM),
    ).toEqual({ count: 2, used: 22, full: true });
  });

  it('should count nothing in when there is no room at all', () => {
    expect(computeFitWithItem(createFit(), PITCH, 0)).toEqual({
      count: 0,
      used: 0,
      full: true,
    });
  });

  it('should not change the count it was given when it adds an item', () => {
    const fit = createFit();

    computeFitWithItem(fit, PITCH, ROOM);

    expect(fit).toEqual(createFit());
  });
});
