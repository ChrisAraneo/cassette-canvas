import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudWindow } from '../types/hud-window';
import { filterOtherWindows } from './filter-other-windows';

const createWindow = (id: string): HudWindow => ({
  id,
  title: id,
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: '',
  widgets: [],
});

const WINDOWS: readonly HudWindow[] = Object.freeze([
  createWindow('street'),
  createWindow('notes'),
]);

describe('filterOtherWindows', () => {
  it('should return the other windows in order when one carries the id', () => {
    expect(
      map(filterOtherWindows(WINDOWS, 'street'), (window) => window.id),
    ).toEqual(['notes']);
  });

  it('should return every window when none has the id', () => {
    expect(filterOtherWindows(WINDOWS, 'ghost')).toEqual(WINDOWS);
  });
});
