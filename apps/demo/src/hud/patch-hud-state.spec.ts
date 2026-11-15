import {
  findHudWidget,
  findHudWindow,
  type Hud,
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_ENTER_KEY,
  HUD_LABEL_PADDING,
  computeTextAdvance,
} from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

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
import { patchHudState } from './patch-hud-state';
import type { HudState } from './types/hud-state';

interface Spot {
  readonly row: number;
  readonly column: number;
}

const WIDGET_INSET = 1;

const TITLE_BAR_INSET = 4;

const DRAG_ROWS = 10;

const DRAG_COLUMNS = -20;

const createState = (): HudState => ({ hud: createDemoHud(), clock: 0 });

const toSpot = (hud: Hud, window: string, widget: string): Spot => {
  const placed = findHudWindow(hud, window);
  const control = findHudWidget(hud, window, widget);

  return {
    row:
      (placed?.row ?? 0) + HUD_CONTENT_TOP + (control?.row ?? 0) + WIDGET_INSET,
    column:
      (placed?.column ?? 0) +
      HUD_CONTENT_LEFT +
      (control?.column ?? 0) +
      WIDGET_INSET,
  };
};

const toTitleSpot = (hud: Hud, window: string): Spot => {
  const placed = findHudWindow(hud, window);

  return {
    row: (placed?.row ?? 0) + TITLE_BAR_INSET,
    column: (placed?.column ?? 0) + TITLE_BAR_INSET,
  };
};

const toSecondTabSpot = (hud: Hud): Spot => {
  const spot = toSpot(hud, STREET_WINDOW, 'pages');

  return {
    row: spot.row,
    column: spot.column + computeTextAdvance(TIME_TAB) + 2 * HUD_LABEL_PADDING,
  };
};

describe('patchHudState', () => {
  it('should return the clock moved when a button is pressed and released', () => {
    const state = createState();
    const spot = toSpot(state.hud, STREET_WINDOW, HOUR_BUTTON);

    expect(
      patchHudState(
        state,
        [
          { kind: 'PRESS', ...spot },
          { kind: 'RELEASE', ...spot },
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
        patchHudState(
          state,
          [
            { kind: 'PRESS', ...spot },
            {
              kind: 'MOVE',
              row: spot.row + DRAG_ROWS,
              column: spot.column + DRAG_COLUMNS,
            },
          ],
          0,
        ).hud,
        NOTE_WINDOW,
      ),
    ).toMatchObject({
      row: (findHudWindow(state.hud, NOTE_WINDOW)?.row ?? 0) + DRAG_ROWS,
      column:
        (findHudWindow(state.hud, NOTE_WINDOW)?.column ?? 0) + DRAG_COLUMNS,
    });
  });

  it('should return the typed line in the title bar when the field is submitted', () => {
    const state = createState();
    const spot = toSpot(state.hud, NOTE_WINDOW, NOTE_FIELD);

    expect(
      findHudWindow(
        patchHudState(
          state,
          [
            { kind: 'PRESS', ...spot },
            { kind: 'RELEASE', ...spot },
            { kind: 'KEY', key: 'A' },
            { kind: 'KEY', key: 'B' },
            { kind: 'KEY', key: HUD_ENTER_KEY },
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
        patchHudState(
          state,
          [
            { kind: 'PRESS', ...spot },
            { kind: 'RELEASE', ...spot },
          ],
          0,
        ).hud,
        STREET_WINDOW,
      )?.page,
    ).toBe(SKY_PAGE);
  });

  it('should return the very same state when nothing happened', () => {
    const state = createState();

    expect(patchHudState(state, [], 0)).toBe(state);
  });

  it('should not change the state it is given when the events are handled', () => {
    const state = createState();

    patchHudState(
      state,
      [{ kind: 'PRESS', ...toTitleSpot(state.hud, NOTE_WINDOW) }],
      0,
    );

    expect(state).toEqual({ hud: createDemoHud(), clock: 0 });
  });
});
