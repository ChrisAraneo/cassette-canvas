import {
  findHudWindow,
  type Hud,
  type HudAction,
} from '@cassette-canvas/engine';
import { filter, map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeDayCycle } from '../../day/compute-day-cycle';
import { HOURS_PER_DAY } from '../../day/consts';
import {
  DUSK_BUTTON,
  DUSK_HOUR,
  HOUR_BUTTON,
  HOUR_LENGTH,
  NOON_BUTTON,
  NOON_HOUR,
  NOTE_BUTTON,
  NOTE_FIELD,
  NOTE_WINDOW,
  NOW_BUTTON,
  STREET_WINDOW,
} from '../consts';
import { createDemoHud } from '../create-demo-hud';
import type { HudState } from '../types/hud-state';
import { applyHudAction } from './apply-hud-action';

const createState = (clock: number): HudState => ({
  hud: createDemoHud(),
  clock,
});

const closeNote = (hud: Hud): Hud => ({
  ...hud,
  windows: filter(hud.windows, (window) => window.id !== NOTE_WINDOW),
});

const click = (widget: string, window = STREET_WINDOW): HudAction => ({
  kind: 'click',
  window,
  widget,
  value: '',
});

describe('applyHudAction', () => {
  it('should move the clock on an hour by the hour button', () => {
    expect(applyHudAction(createState(0), click(HOUR_BUTTON), 0).clock).toBe(
      HOUR_LENGTH,
    );
  });

  it('should bring the clock back to the animation on the now button', () => {
    expect(
      applyHudAction(createState(5 * HOUR_LENGTH), click(NOW_BUTTON), 0).clock,
    ).toBe(0);
  });

  it('should jump to the evening on the dusk button', () => {
    expect(
      computeDayCycle(
        applyHudAction(createState(0), click(DUSK_BUTTON), 0).clock,
      ).phase,
    ).toBeCloseTo(DUSK_HOUR / HOURS_PER_DAY);
  });

  it('should jump to the middle of the day on the noon button', () => {
    expect(
      computeDayCycle(
        applyHudAction(createState(0), click(NOON_BUTTON), 0).clock,
      ).phase,
    ).toBeCloseTo(NOON_HOUR / HOURS_PER_DAY);
  });

  it('should bring the note window back on the note button', () => {
    expect(
      findHudWindow(
        applyHudAction(
          { hud: closeNote(createDemoHud()), clock: 0 },
          click(NOTE_BUTTON),
          0,
        ).hud,
        NOTE_WINDOW,
      ),
    ).toBeDefined();
  });

  it('should write a line typed in the field in the title bar', () => {
    expect(
      findHudWindow(
        applyHudAction(
          createState(0),
          {
            kind: 'submit',
            window: NOTE_WINDOW,
            widget: NOTE_FIELD,
            value: 'Evening',
          },
          0,
        ).hud,
        NOTE_WINDOW,
      )?.title,
    ).toBe('Evening');
  });

  it('should leave the state as it is when a tab is opened', () => {
    const state = createState(0);

    expect(
      applyHudAction(
        state,
        { kind: 'tab', window: STREET_WINDOW, widget: 'pages', value: 'sky' },
        0,
      ),
    ).toBe(state);
  });

  it('should leave the state as it is when a window it does not know is clicked', () => {
    const state = createState(0);

    expect(applyHudAction(state, click(HOUR_BUTTON, 'other'), 0)).toBe(state);
  });

  it('should leave the windows alone when it moves the clock', () => {
    const state = createState(0);

    expect(
      map(
        applyHudAction(state, click(HOUR_BUTTON), 0).hud.windows,
        (window) => window.title,
      ),
    ).toEqual(map(state.hud.windows, (window) => window.title));
  });
});
