import { describe, expect, it } from 'vitest';

import type { HudTabs } from '../types/hud-tabs';
import { computeTabRects } from './compute-tab-rects';
import { findTab } from './find-tab';

const TABS: HudTabs = Object.freeze({
  kind: 'TABS',
  id: 'pages',
  page: '',
  row: 0,
  column: 0,
  tabs: Object.freeze([
    { id: 'tracks', text: 'TRACKS' },
    { id: 'about', text: 'ABOUT' },
  ]),
});

const RECTS = computeTabRects(TABS);

const INSIDE_TAB = 2;

describe('findTab', () => {
  it('should find the first tab when the pointer sits on it', () => {
    const first = RECTS[0];

    expect(
      findTab(
        TABS,
        (first?.row ?? 0) + INSIDE_TAB,
        (first?.column ?? 0) + INSIDE_TAB,
      )?.id,
    ).toBe('tracks');
  });

  it('should find the next tab when the pointer sits on that one', () => {
    const second = RECTS[1];

    expect(
      findTab(
        TABS,
        (second?.row ?? 0) + INSIDE_TAB,
        (second?.column ?? 0) + INSIDE_TAB,
      )?.id,
    ).toBe('about');
  });

  it('should find nothing when the pointer sits past the end of the strip', () => {
    expect(findTab(TABS, 0, 999)).toBeUndefined();
  });

  it('should find nothing when the pointer sits above the strip', () => {
    expect(findTab(TABS, -5, 0)).toBeUndefined();
  });

  it('should find nothing when the strip holds no tabs', () => {
    expect(findTab({ ...TABS, tabs: [] }, 0, 0)).toBeUndefined();
  });
});
