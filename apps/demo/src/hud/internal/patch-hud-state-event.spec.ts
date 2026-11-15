import {
  findHudWidget,
  findHudWindow,
  type Hud,
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_ENTER_KEY,
} from '@cassette-canvas/engine';
import { constant } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import {
  HOUR_BUTTON,
  HOUR_LENGTH,
  NOTE_FIELD,
  NOTE_WINDOW,
  STREET_WINDOW,
} from '../consts';
import { createDemoHud } from '../create-demo-hud';
import type { HudState } from '../types/hud-state';
import { patchHudStateEvent } from './patch-hud-state-event';

interface Spot {
  readonly row: number;
  readonly column: number;
}

const WIDGET_INSET = 1;

const TITLE_BAR_INSET = 4;

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

const findFieldText = (hud: Hud): string | undefined =>
  match(findHudWidget(hud, NOTE_WINDOW, NOTE_FIELD))
    .with({ kind: 'INPUT' }, ({ text }) => text)
    .otherwise(constant(undefined));

describe('patchHudStateEvent', () => {
  it('should return the window grabbed when its title bar is pressed', () => {
    const state = createState();

    expect(
      patchHudStateEvent(
        state,
        { kind: 'PRESS', ...toTitleSpot(state.hud, NOTE_WINDOW) },
        0,
      ).hud.grab,
    ).toMatchObject({ kind: 'DRAG', window: NOTE_WINDOW });
  });

  it('should return the focus on the field when it is pressed', () => {
    const state = createState();

    expect(
      patchHudStateEvent(
        state,
        { kind: 'PRESS', ...toSpot(state.hud, NOTE_WINDOW, NOTE_FIELD) },
        0,
      ).hud.focus,
    ).toEqual({ window: NOTE_WINDOW, widget: NOTE_FIELD });
  });

  it('should return the character in the focused field when a key goes down', () => {
    const state = createState();

    expect(
      findFieldText(
        patchHudStateEvent(
          {
            ...state,
            hud: {
              ...state.hud,
              focus: { window: NOTE_WINDOW, widget: NOTE_FIELD },
            },
          },
          { kind: 'KEY', key: 'A' },
          0,
        ).hud,
      ),
    ).toBe('A');
  });

  it('should return the clock moved when a press and a release cause an hour click', () => {
    const state = createState();
    const spot = toSpot(state.hud, STREET_WINDOW, HOUR_BUTTON);

    expect(
      patchHudStateEvent(
        patchHudStateEvent(state, { kind: 'PRESS', ...spot }, 0),
        { kind: 'RELEASE', ...spot },
        0,
      ).clock,
    ).toBe(HOUR_LENGTH);
  });

  it('should return the line in the title bar when the field reads the enter key', () => {
    const state = createState();

    expect(
      findHudWindow(
        patchHudStateEvent(
          {
            ...state,
            hud: {
              ...state.hud,
              focus: { window: NOTE_WINDOW, widget: NOTE_FIELD },
            },
          },
          { kind: 'KEY', key: HUD_ENTER_KEY },
          0,
        ).hud,
        NOTE_WINDOW,
      )?.title,
    ).toBeDefined();
  });

  it('should not change the state it is given when it handles an event', () => {
    const state = createState();

    patchHudStateEvent(
      state,
      { kind: 'PRESS', ...toTitleSpot(state.hud, NOTE_WINDOW) },
      0,
    );

    expect(state).toEqual({ hud: createDemoHud(), clock: 0 });
  });
});
