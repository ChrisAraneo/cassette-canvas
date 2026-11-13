import {
  findHudWidget,
  findHudWindow,
  type Hud,
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_ENTER_KEY,
} from '@cassette-canvas/engine';
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
import { applyHudEvent } from './apply-hud-event';

interface Spot {
  readonly row: number;
  readonly column: number;
}

const createState = (): HudState => ({ hud: createDemoHud(), clock: 0 });

/** The top-left pixel of a widget on the screen, plus a pixel of air. */
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

  return {
    row: (placed?.row ?? 0) + 4,
    column: (placed?.column ?? 0) + 4,
  };
};

const toFieldText = (hud: Hud): string | undefined =>
  match(findHudWidget(hud, NOTE_WINDOW, NOTE_FIELD))
    .with({ kind: 'input' }, ({ text }) => text)
    .otherwise(() => undefined);

describe('applyHudEvent', () => {
  it('should take hold of a window when its title bar is pressed', () => {
    const state = createState();

    expect(
      applyHudEvent(
        state,
        { kind: 'press', ...toTitleSpot(state.hud, NOTE_WINDOW) },
        0,
      ).hud.grab,
    ).toMatchObject({ kind: 'drag', window: NOTE_WINDOW });
  });

  it('should give the field the keys when it is pressed', () => {
    const state = createState();

    expect(
      applyHudEvent(
        state,
        { kind: 'press', ...toSpot(state.hud, NOTE_WINDOW, NOTE_FIELD) },
        0,
      ).hud.focus,
    ).toEqual({ window: NOTE_WINDOW, widget: NOTE_FIELD });
  });

  it('should type into the field that has the keys', () => {
    const state = createState();

    expect(
      toFieldText(
        applyHudEvent(
          {
            ...state,
            hud: {
              ...state.hud,
              focus: { window: NOTE_WINDOW, widget: NOTE_FIELD },
            },
          },
          { kind: 'key', key: 'A' },
          0,
        ).hud,
      ),
    ).toBe('A');
  });

  it('should answer what came of the event', () => {
    const state = createState();
    const spot = toSpot(state.hud, STREET_WINDOW, HOUR_BUTTON);

    expect(
      applyHudEvent(
        applyHudEvent(state, { kind: 'press', ...spot }, 0),
        { kind: 'release', ...spot },
        0,
      ).clock,
    ).toBe(HOUR_LENGTH);
  });

  it('should write a line in the title bar when the field answers the enter key', () => {
    const state = createState();

    expect(
      findHudWindow(
        applyHudEvent(
          {
            ...state,
            hud: {
              ...state.hud,
              focus: { window: NOTE_WINDOW, widget: NOTE_FIELD },
            },
          },
          { kind: 'key', key: HUD_ENTER_KEY },
          0,
        ).hud,
        NOTE_WINDOW,
      )?.title,
    ).toBeDefined();
  });

  it('should not change the state it is given', () => {
    const state = createState();

    applyHudEvent(
      state,
      { kind: 'press', ...toTitleSpot(state.hud, NOTE_WINDOW) },
      0,
    );

    expect(state).toEqual({ hud: createDemoHud(), clock: 0 });
  });
});
