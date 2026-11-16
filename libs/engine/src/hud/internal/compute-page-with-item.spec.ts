import { describe, expect, it } from 'vitest';

import { computePageWithItem } from './compute-page-with-item';
import type { HudListLastPage } from './types/hud-list-last-page';

const ROOM = 30;

const PITCH = 11;

const createPage = (): HudListLastPage => ({ start: 6, used: 0, full: false });

describe('computePageWithItem', () => {
  it('should start the page at the item when the item still fits in the room', () => {
    expect(computePageWithItem(createPage(), 5, PITCH, ROOM)).toEqual({
      start: 5,
      used: PITCH,
      full: false,
    });
  });

  it('should fill the page up when the item no longer fits in the room', () => {
    expect(
      computePageWithItem({ start: 4, used: 28, full: false }, 3, PITCH, ROOM),
    ).toEqual({ start: 4, used: 28, full: true });
  });

  it('should keep the page where it is once the page is full', () => {
    expect(
      computePageWithItem({ start: 4, used: 22, full: true }, 3, PITCH, ROOM),
    ).toEqual({ start: 4, used: 22, full: true });
  });

  it('should fill the page up when there is no room at all', () => {
    expect(computePageWithItem(createPage(), 5, PITCH, 0).full).toBe(true);
  });

  it('should not change the page it was given when it adds an item', () => {
    const page = createPage();

    computePageWithItem(page, 5, PITCH, ROOM);

    expect(page).toEqual(createPage());
  });
});
