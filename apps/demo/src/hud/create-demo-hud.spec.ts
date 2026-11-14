import { DEFAULT_HUD_COLOR, findHudWindow } from '@cassette-canvas/engine';
import { every, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { DEMO_COLORS, SAND } from '../art/consts';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../street/consts';
import { NOTE_WINDOW, STREET_WINDOW, TAPE_WINDOW, TIME_PAGE } from './consts';
import { createDemoHud } from './create-demo-hud';

describe('createDemoHud', () => {
  it('should return the street, the note, and the tape window when it makes the HUD', () => {
    expect(map(createDemoHud().windows, (window) => window.id)).toEqual([
      STREET_WINDOW,
      NOTE_WINDOW,
      TAPE_WINDOW,
    ]);
  });

  it('should return the time page as the open page of the street window when it makes the HUD', () => {
    expect(findHudWindow(createDemoHud(), STREET_WINDOW)?.page).toBe(TIME_PAGE);
  });

  it('should return the street window as not closable when it makes the HUD, so there is always one to drag', () => {
    expect(findHudWindow(createDemoHud(), STREET_WINDOW)?.closable).toBe(false);
  });

  it('should return the note window as closable when it makes the HUD', () => {
    expect(findHudWindow(createDemoHud(), NOTE_WINDOW)?.closable).toBe(true);
  });

  it('should return the sand color, the closest one to beige, when the demo palette is in use', () => {
    expect(DEMO_COLORS[createDemoHud().theme.color]).toBe(DEMO_COLORS[SAND]);
  });

  it('should return the default HUD color as the theme color when the palette has no sand', () => {
    expect(createDemoHud().theme.color).toBe(DEFAULT_HUD_COLOR);
  });

  it('should return the street screen as the size no window can be dragged past', () => {
    expect(createDemoHud().size).toEqual({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
  });

  it('should return every window inside the street screen when it makes the HUD', () => {
    expect(
      every(
        createDemoHud().windows,
        (window) =>
          window.row + window.height <= SCREEN_HEIGHT &&
          window.column + window.width <= SCREEN_WIDTH,
      ),
    ).toBe(true);
  });

  it('should return no grab and no focus when nothing is pressed yet', () => {
    expect([createDemoHud().grab, createDemoHud().focus]).toEqual([
      undefined,
      undefined,
    ]);
  });
});
