import { describe, expect, it } from 'vitest';

import type { HudWidget } from '../types/hud-widget';
import { computeFirstPage } from './compute-first-page';

const TABS: HudWidget = Object.freeze({
  kind: 'tabs',
  id: 'tabs',
  page: '',
  row: 0,
  column: 0,
  tabs: [
    { id: 'scene', text: 'SCENE' },
    { id: 'light', text: 'LIGHT' },
  ],
});

const LABEL: HudWidget = Object.freeze({
  kind: 'label',
  id: 'fps',
  page: '',
  row: 0,
  column: 0,
  text: 'FPS',
});

describe('computeFirstPage', () => {
  it('should return the first tab of the first strip when the widgets hold one', () => {
    expect(computeFirstPage([LABEL, TABS])).toBe('scene');
  });

  it('should return an empty page when there are no tabs', () => {
    expect(computeFirstPage([LABEL])).toBe('');
  });

  it('should return an empty page when the strip holds no tabs', () => {
    expect(computeFirstPage([{ ...TABS, tabs: [] }])).toBe('');
  });

  it('should return an empty page when there are no widgets at all', () => {
    expect(computeFirstPage([])).toBe('');
  });
});
