import { describe, expect, it } from 'vitest';

import type { HudList } from '../types/hud-list';
import { computeListRoom } from './compute-list-room';

const createList = (height: number): HudList => ({
  kind: 'list',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height,
  items: [],
  scroll: 0,
  selected: '',
});

describe('computeListRoom', () => {
  it('should return the height without the padding and with one divider back when it measures a list', () => {
    expect(computeListRoom(createList(48))).toBe(46);
  });

  it('should return no room at all when the list is as short as its padding', () => {
    expect(computeListRoom(createList(2))).toBe(0);
  });

  it('should return no room at all when the list has no height', () => {
    expect(computeListRoom(createList(0))).toBe(0);
  });
});
