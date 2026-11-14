import { describe, expect, it } from 'vitest';

import type { HudWindow } from '../types/hud-window';
import { patchMatchingWindow } from './patch-matching-window';

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 10,
  column: 20,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: 'scene',
  widgets: [],
});

describe('patchMatchingWindow', () => {
  it('should return every change when the window carries the id', () => {
    expect(
      patchMatchingWindow(WINDOW, 'street', {
        title: 'NOTES',
        row: 1,
        column: 2,
        width: 40,
        height: 30,
        color: 9,
        closable: false,
        page: 'light',
        widgets: [],
      }),
    ).toEqual({
      id: 'street',
      title: 'NOTES',
      row: 1,
      column: 2,
      width: 40,
      height: 30,
      color: 9,
      closable: false,
      page: 'light',
      widgets: [],
    });
  });

  it('should return the fields the changes leave out when the window carries the id', () => {
    expect(patchMatchingWindow(WINDOW, 'street', { row: 1 })).toEqual({
      ...WINDOW,
      row: 1,
    });
  });

  it('should return the very same window when the id does not match', () => {
    expect(patchMatchingWindow(WINDOW, 'notes', { row: 1 })).toBe(WINDOW);
  });
});
