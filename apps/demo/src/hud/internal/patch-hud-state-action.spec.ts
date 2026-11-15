import {
  findHudWidget,
  findHudWindow,
  type Hud,
  type HudAction,
  TEXT_HEART,
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
  PLAY_BUTTON,
  STREET_WINDOW,
  TAPE_LABEL,
  TAPE_LIST,
  TAPE_WINDOW,
} from '../consts';
import { createDemoHud } from '../create-demo-hud';
import type { HudState } from '../types/hud-state';
import { patchHudStateAction } from './patch-hud-state-action';

const createState = (clock: number): HudState => ({
  hud: createDemoHud(),
  clock,
});

const closeNote = (hud: Hud): Hud => ({
  ...hud,
  windows: filter(hud.windows, (window) => window.id !== NOTE_WINDOW),
});

const toClickAction = (widget: string, window = STREET_WINDOW): HudAction => ({
  kind: 'CLICK',
  window,
  widget,
  value: '',
});

describe('patchHudStateAction', () => {
  it('should return the clock moved on an hour when the hour button is clicked', () => {
    expect(
      patchHudStateAction(createState(0), toClickAction(HOUR_BUTTON), 0).clock,
    ).toBe(HOUR_LENGTH);
  });

  it('should return the clock back at the animation when the now button is clicked', () => {
    expect(
      patchHudStateAction(
        createState(5 * HOUR_LENGTH),
        toClickAction(NOW_BUTTON),
        0,
      ).clock,
    ).toBe(0);
  });

  it('should return the clock at the evening when the dusk button is clicked', () => {
    expect(
      computeDayCycle(
        patchHudStateAction(createState(0), toClickAction(DUSK_BUTTON), 0)
          .clock,
      ).phase,
    ).toBeCloseTo(DUSK_HOUR / HOURS_PER_DAY);
  });

  it('should return the clock at the middle of the day when the noon button is clicked', () => {
    expect(
      computeDayCycle(
        patchHudStateAction(createState(0), toClickAction(NOON_BUTTON), 0)
          .clock,
      ).phase,
    ).toBeCloseTo(NOON_HOUR / HOURS_PER_DAY);
  });

  it('should return the note window back on the screen when the note button is clicked', () => {
    expect(
      findHudWindow(
        patchHudStateAction(
          { hud: closeNote(createDemoHud()), clock: 0 },
          toClickAction(NOTE_BUTTON),
          0,
        ).hud,
        NOTE_WINDOW,
      ),
    ).toBeDefined();
  });

  it('should return the typed line in the title bar when the action is a submit', () => {
    expect(
      findHudWindow(
        patchHudStateAction(
          createState(0),
          {
            kind: 'SUBMIT',
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

  it('should return the track in the readout when one is picked from the list', () => {
    expect(
      findHudWidget(
        patchHudStateAction(
          createState(0),
          {
            kind: 'SELECT',
            window: TAPE_WINDOW,
            widget: TAPE_LIST,
            value: 'neon',
          },
          0,
        ).hud,
        TAPE_WINDOW,
        TAPE_LABEL,
      ),
    ).toMatchObject({ text: `${TEXT_HEART} NEON RAIN` });
  });

  it('should return the track in the readout when the play button on it is clicked', () => {
    expect(
      findHudWidget(
        patchHudStateAction(
          createState(0),
          toClickAction(`${PLAY_BUTTON}-deck`, TAPE_WINDOW),
          0,
        ).hud,
        TAPE_WINDOW,
        TAPE_LABEL,
      ),
    ).toMatchObject({ text: `${TEXT_HEART} CASSETTE DECK` });
  });

  it('should return the track selected in the list when the play button on it is clicked', () => {
    expect(
      findHudWidget(
        patchHudStateAction(
          createState(0),
          toClickAction(`${PLAY_BUTTON}-deck`, TAPE_WINDOW),
          0,
        ).hud,
        TAPE_WINDOW,
        TAPE_LIST,
      ),
    ).toMatchObject({ selected: 'deck' });
  });

  it('should return the state unchanged when a window is closed', () => {
    const state = createState(0);

    expect(
      patchHudStateAction(
        state,
        { kind: 'CLOSE', window: NOTE_WINDOW, widget: '', value: '' },
        0,
      ),
    ).toBe(state);
  });

  it('should return the state unchanged when a line is typed into the field', () => {
    const state = createState(0);

    expect(
      patchHudStateAction(
        state,
        {
          kind: 'TYPE',
          window: NOTE_WINDOW,
          widget: NOTE_FIELD,
          value: 'Evenin',
        },
        0,
      ),
    ).toBe(state);
  });

  it('should return the state unchanged when a tab is opened', () => {
    const state = createState(0);

    expect(
      patchHudStateAction(
        state,
        { kind: 'TAB', window: STREET_WINDOW, widget: 'pages', value: 'sky' },
        0,
      ),
    ).toBe(state);
  });

  it('should return the state unchanged when a window it does not know is clicked', () => {
    const state = createState(0);

    expect(
      patchHudStateAction(state, toClickAction(HOUR_BUTTON, 'other'), 0),
    ).toBe(state);
  });

  it('should return the windows unchanged when it moves the clock', () => {
    const state = createState(0);

    expect(
      map(
        patchHudStateAction(state, toClickAction(HOUR_BUTTON), 0).hud.windows,
        (window) => window.title,
      ),
    ).toEqual(map(state.hud.windows, (window) => window.title));
  });
});
