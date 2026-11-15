import type { HudAction } from '@cassette-canvas/engine';
import { match } from 'ts-pattern';
import {
  DUSK_BUTTON,
  DUSK_HOUR,
  HOUR_BUTTON,
  NOON_BUTTON,
  NOON_HOUR,
  NOTE_BUTTON,
  NOTE_WINDOW,
  NOW_BUTTON,
  STREET_WINDOW,
  TAPE_WINDOW,
} from '../consts';
import type { HudState } from '../types/hud-state';
import { addNoteWindow } from './add-note-window';
import { patchHudStateClock } from './patch-hud-state-clock';
import { patchHudStateHour } from './patch-hud-state-hour';
import { patchHudStateNow } from './patch-hud-state-now';
import { patchNoteTitle } from './patch-note-title';
import { patchTapeTrack } from './patch-tape-track';
import { toTrackId } from './to-track-id';

/**
 * Handles one action the person caused: the buttons move the street clock or
 * bring the note window back, a line typed into the field becomes the title
 * of the note window, and a track picked from the list, or the play button
 * pressed on one, shows in the tape window's readout. Anything else, such as
 * opening a tab, scrolling a list, or dragging a window, the HUD has already
 * handled by itself.
 */
export const patchHudStateAction = (
  state: HudState,
  action: HudAction,
  time: number,
): HudState =>
  match(action)
    .with({ kind: 'CLICK', window: STREET_WINDOW, widget: HOUR_BUTTON }, () =>
      patchHudStateHour(state),
    )
    .with({ kind: 'CLICK', window: STREET_WINDOW, widget: NOW_BUTTON }, () =>
      patchHudStateNow(state),
    )
    .with({ kind: 'CLICK', window: STREET_WINDOW, widget: DUSK_BUTTON }, () =>
      patchHudStateClock(state, time, DUSK_HOUR),
    )
    .with({ kind: 'CLICK', window: STREET_WINDOW, widget: NOON_BUTTON }, () =>
      patchHudStateClock(state, time, NOON_HOUR),
    )
    .with(
      { kind: 'CLICK', window: STREET_WINDOW, widget: NOTE_BUTTON },
      () => ({
        ...state,
        hud: addNoteWindow(state.hud),
      }),
    )
    .with({ kind: 'SUBMIT', window: NOTE_WINDOW }, ({ value }) => ({
      ...state,
      hud: patchNoteTitle(state.hud, value),
    }))
    .with({ kind: 'SELECT', window: TAPE_WINDOW }, ({ value }) => ({
      ...state,
      hud: patchTapeTrack(state.hud, value),
    }))
    .with({ kind: 'CLICK', window: TAPE_WINDOW }, ({ widget }) => ({
      ...state,
      hud: patchTapeTrack(state.hud, toTrackId(widget)),
    }))
    .otherwise(() => state);
