import { type Hud, patchHudWidget, TEXT_HEART } from '@cassette-canvas/engine';
import { find } from 'lodash-es';
import { match, P } from 'ts-pattern';
import {
  TAPE_HINT,
  TAPE_LABEL,
  TAPE_LIST,
  TAPE_TRACKS,
  TAPE_WINDOW,
} from '../consts';

const { nonNullable } = P;

const toReadout = (id: string): string =>
  match(find(TAPE_TRACKS, (track) => track.id === id))
    .with(nonNullable, (track) => `${TEXT_HEART} ${track.title}`)
    .otherwise(() => TAPE_HINT);

/**
 * Writes the track that was picked into the readout on the panel at the top
 * of the tape window, with a heart in front of it, and marks it as the one
 * the list has selected, so picking a track and pressing its play button
 * come to the same thing. An id no track has puts the hint back and leaves
 * nothing selected.
 */
export const playTrack = (hud: Hud, id: string): Hud =>
  patchHudWidget(
    patchHudWidget(hud, TAPE_WINDOW, TAPE_LABEL, { text: toReadout(id) }),
    TAPE_WINDOW,
    TAPE_LIST,
    { selected: id },
  );
