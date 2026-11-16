import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { HUD_CONTROL_HEIGHT } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import { addTabRect } from './add-tab-rect';
import { computeControlWidth } from './compute-control-width';

const TAB: HudTab = Object.freeze({ id: 'tracks', text: 'TRACKS' });

const OTHER_TAB: HudTab = Object.freeze({ id: 'about', text: 'ABOUT' });

const createRects = (): HudRect[] => [];

describe('addTabRect', () => {
  it('should put the first tab where the strip starts when it adds one', () => {
    expect(addTabRect(createRects(), TAB, 20, 6)[0]).toEqual({
      row: 20,
      column: 6,
      width: computeControlWidth('TRACKS'),
      height: HUD_CONTROL_HEIGHT,
    });
  });

  it('should put the next tab right after the one before it when it adds one', () => {
    expect(
      addTabRect(addTabRect(createRects(), TAB, 20, 6), OTHER_TAB, 20, 6)[1]
        ?.column,
    ).toBe(6 + computeControlWidth('TRACKS'));
  });

  it('should make each tab as wide as its own text when it adds one', () => {
    expect(addTabRect(createRects(), OTHER_TAB, 20, 6)[0]?.width).toBe(
      computeControlWidth('ABOUT'),
    );
  });

  it('should keep the tabs it was given when it adds one', () => {
    expect(
      size(addTabRect(addTabRect(createRects(), TAB, 20, 6), OTHER_TAB, 20, 6)),
    ).toBe(2);
  });

  it('should not change the tabs it was given when it adds one', () => {
    const rects = createRects();

    addTabRect(rects, TAB, 20, 6);

    expect(rects).toEqual(createRects());
  });
});
