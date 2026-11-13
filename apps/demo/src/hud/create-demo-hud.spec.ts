import { DEFAULT_HUD_COLOR, findHudWindow } from '@cassette-canvas/engine';
import { every, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { DEMO_COLORS, SAND } from '../art/consts';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../street/consts';
import { NOTE_WINDOW, STREET_WINDOW, TIME_PAGE } from './consts';
import { createDemoHud } from './create-demo-hud';

describe('createDemoHud', () => {
  it('should hold the street window and the note window', () => {
    expect(map(createDemoHud().windows, (window) => window.id)).toEqual([
      STREET_WINDOW,
      NOTE_WINDOW,
    ]);
  });

  it('should open the time page of the street window', () => {
    expect(findHudWindow(createDemoHud(), STREET_WINDOW)?.page).toBe(TIME_PAGE);
  });

  it('should keep the street window, so there is always one to drag', () => {
    expect(findHudWindow(createDemoHud(), STREET_WINDOW)?.closable).toBe(false);
  });

  it('should let the note window be closed', () => {
    expect(findHudWindow(createDemoHud(), NOTE_WINDOW)?.closable).toBe(true);
  });

  it('should draw the HUD in the sand color, the closest one to beige', () => {
    expect(DEMO_COLORS[createDemoHud().theme.color]).toBe(DEMO_COLORS[SAND]);
  });

  it('should draw the HUD in the color a HUD starts in', () => {
    expect(createDemoHud().theme.color).toBe(DEFAULT_HUD_COLOR);
  });

  it('should fit both windows on the street screen', () => {
    expect(
      every(
        createDemoHud().windows,
        (window) =>
          window.row + window.height <= SCREEN_HEIGHT &&
          window.column + window.width <= SCREEN_WIDTH,
      ),
    ).toBe(true);
  });

  it('should take hold of nothing before anything is pressed', () => {
    expect([createDemoHud().grab, createDemoHud().focus]).toEqual([
      undefined,
      undefined,
    ]);
  });
});
