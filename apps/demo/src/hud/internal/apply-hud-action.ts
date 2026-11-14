import type { HudAction } from '@cassette-canvas/engine';
import { match } from 'ts-pattern';
import {
  DUSK_BUTTON,
  DUSK_HOUR,
  HOUR_BUTTON,
  HOUR_LENGTH,
  NOON_BUTTON,
  NOON_HOUR,
  NOTE_BUTTON,
  NOTE_WINDOW,
  NOW_BUTTON,
  STREET_WINDOW,
  TAPE_WINDOW,
} from '../consts';
import type { HudState } from '../types/hud-state';
import { jumpClock } from './jump-clock';
import { openNoteWindow } from './open-note-window';
import { playTrack } from './play-track';
import { renameNoteWindow } from './rename-note-window';
import { toTrackId } from './to-track-id';

/**
 * Handles one action the person caused: the buttons move the street clock or
 * bring the note window back, a line typed into the field becomes the title
 * of the note window, and a track picked from the list, or the play button
 * pressed on one, shows in the tape window's readout. Anything else, such as
 * opening a tab, scrolling a list, or dragging a window, the HUD has already
 * handled by itself.
 */
export const applyHudAction = (
  state: HudState,
  action: HudAction,
  time: number,
): HudState =>
  match(action)
    .with(
      { kind: 'click', window: STREET_WINDOW, widget: HOUR_BUTTON },
      () => ({ ...state, clock: state.clock + HOUR_LENGTH }),
    )
    .with({ kind: 'click', window: STREET_WINDOW, widget: NOW_BUTTON }, () => ({
      ...state,
      clock: 0,
    }))
    .with({ kind: 'click', window: STREET_WINDOW, widget: DUSK_BUTTON }, () =>
      jumpClock(state, time, DUSK_HOUR),
    )
    .with({ kind: 'click', window: STREET_WINDOW, widget: NOON_BUTTON }, () =>
      jumpClock(state, time, NOON_HOUR),
    )
    .with(
      { kind: 'click', window: STREET_WINDOW, widget: NOTE_BUTTON },
      () => ({
        ...state,
        hud: openNoteWindow(state.hud),
      }),
    )
    .with({ kind: 'submit', window: NOTE_WINDOW }, ({ value }) => ({
      ...state,
      hud: renameNoteWindow(state.hud, value),
    }))
    .with({ kind: 'select', window: TAPE_WINDOW }, ({ value }) => ({
      ...state,
      hud: playTrack(state.hud, value),
    }))
    .with({ kind: 'click', window: TAPE_WINDOW }, ({ widget }) => ({
      ...state,
      hud: playTrack(state.hud, toTrackId(widget)),
    }))
    .otherwise(() => state);
