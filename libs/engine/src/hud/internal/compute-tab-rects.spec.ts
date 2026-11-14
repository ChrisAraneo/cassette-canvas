import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_CONTROL_HEIGHT,
} from '../consts';
import type { HudTabs } from '../types/hud-tabs';
import { computeControlWidth } from './compute-control-width';
import { computeTabRects } from './compute-tab-rects';

const TABS: HudTabs = Object.freeze({
  kind: 'tabs',
  id: 'tabs',
  page: '',
  row: 4,
  column: 6,
  tabs: [
    { id: 'scene', text: 'SCENE' },
    { id: 'light', text: 'LIGHT' },
  ],
});

describe('computeTabRects', () => {
  it('should return the first tab where the strip is placed when it measures the tabs', () => {
    expect(computeTabRects(TABS)[0]).toEqual({
      row: HUD_CONTENT_TOP + 4,
      column: HUD_CONTENT_LEFT + 6,
      width: computeControlWidth('SCENE'),
      height: HUD_CONTROL_HEIGHT,
    });
  });

  it('should return the next tab right after the one before it when it measures the tabs', () => {
    expect(computeTabRects(TABS)[1]?.column).toBe(
      HUD_CONTENT_LEFT + 6 + computeControlWidth('SCENE'),
    );
  });

  it('should return every tab as wide as its own text when it measures the tabs', () => {
    expect(map(computeTabRects(TABS), (rect) => rect.width)).toEqual([
      computeControlWidth('SCENE'),
      computeControlWidth('LIGHT'),
    ]);
  });

  it('should return no rectangles when the strip holds no tabs', () => {
    expect(computeTabRects({ ...TABS, tabs: [] })).toEqual([]);
  });
});
