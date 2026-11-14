import {
  findHudWidget,
  findHudWindow,
  type Hud,
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_ENTER_KEY,
  HUD_LABEL_PADDING,
  measureText,
} from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { applyHudEvents } from './apply-hud-events';
import {
  HOUR_BUTTON,
  HOUR_LENGTH,
  NOTE_FIELD,
  NOTE_WINDOW,
  SKY_PAGE,
  STREET_WINDOW,
  TIME_TAB,
} from './consts';
import { createDemoHud } from './create-demo-hud';
import type { HudState } from './types/hud-state';

interface Spot {
  readonly row: number;
  readonly column: number;
}

const createState = (): HudState => ({ hud: createDemoHud(), clock: 0 });

/** The top-left pixel of a widget on the screen, plus a pixel of padding. */
const toSpot = (hud: Hud, window: string, widget: string): Spot => {
  const placed = findHudWindow(hud, window);
  const control = findHudWidget(hud, window, widget);

  return {
    row: (placed?.row ?? 0) + HUD_CONTENT_TOP + (control?.row ?? 0) + 1,
    column:
      (placed?.column ?? 0) + HUD_CONTENT_LEFT + (control?.column ?? 0) + 1,
  };
};

const toTitleSpot = (hud: Hud, window: string): Spot => {
  const placed = findHudWindow(hud, window);

  return { row: (placed?.row ?? 0) + 4, column: (placed?.column ?? 0) + 4 };
};

/** The second tab sits right of the first one. */
const toSecondTabSpot = (hud: Hud): Spot => {
  const spot = toSpot(hud, STREET_WINDOW, 'pages');

  return {
    row: spot.row,
    column: spot.column + measureText(TIME_TAB) + 2 * HUD_LABEL_PADDING,
  };
};

describe('applyHudEvents', () => {
  it('should return the clock moved when a button is pressed and released', () => {
    const state = createState();
    const spot = toSpot(state.hud, STREET_WINDOW, HOUR_BUTTON);

    expect(
      applyHudEvents(
        state,
        [
          { kind: 'press', ...spot },
          { kind: 'release', ...spot },
        ],
        0,
      ).clock,
    ).toBe(HOUR_LENGTH);
  });

  it('should return the window moved when its title bar is dragged', () => {
    const state = createState();
    const spot = toTitleSpot(state.hud, NOTE_WINDOW);

    expect(
      findHudWindow(
        applyHudEvents(
          state,
          [
            { kind: 'press', ...spot },
            { kind: 'move', row: spot.row + 10, column: spot.column - 20 },
          ],
          0,
        ).hud,
        NOTE_WINDOW,
      ),
    ).toMatchObject({
      row: (findHudWindow(state.hud, NOTE_WINDOW)?.row ?? 0) + 10,
      column: (findHudWindow(state.hud, NOTE_WINDOW)?.column ?? 0) - 20,
    });
  });

  it('should return the typed line in the title bar when the field is submitted', () => {
    const state = createState();
    const spot = toSpot(state.hud, NOTE_WINDOW, NOTE_FIELD);

    expect(
      findHudWindow(
        applyHudEvents(
          state,
          [
            { kind: 'press', ...spot },
            { kind: 'release', ...spot },
            { kind: 'key', key: 'A' },
            { kind: 'key', key: 'B' },
            { kind: 'key', key: HUD_ENTER_KEY },
          ],
          0,
        ).hud,
        NOTE_WINDOW,
      )?.title,
    ).toBe('AB');
  });

  it('should return the sky page as the open page when its tab is pressed', () => {
    const state = createState();
    const spot = toSecondTabSpot(state.hud);

    expect(
      findHudWindow(
        applyHudEvents(
          state,
          [
            { kind: 'press', ...spot },
            { kind: 'release', ...spot },
          ],
          0,
        ).hud,
        STREET_WINDOW,
      )?.page,
    ).toBe(SKY_PAGE);
  });

  it('should return the very same state when nothing happened', () => {
    const state = createState();

    expect(applyHudEvents(state, [], 0)).toBe(state);
  });

  it('should not change the state it is given when it applies the events', () => {
    const state = createState();

    applyHudEvents(
      state,
      [{ kind: 'press', ...toTitleSpot(state.hud, NOTE_WINDOW) }],
      0,
    );

    expect(state).toEqual({ hud: createDemoHud(), clock: 0 });
  });
});
