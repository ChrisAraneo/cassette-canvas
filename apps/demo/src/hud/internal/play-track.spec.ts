import { findHudWidget, TEXT_HEART } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { TAPE_HINT, TAPE_LABEL, TAPE_LIST, TAPE_WINDOW } from '../consts';
import { createDemoHud } from '../create-demo-hud';
import { playTrack } from './play-track';

describe('playTrack', () => {
  it('should return the track in the readout, with a heart in front of it, when one is picked', () => {
    expect(
      findHudWidget(
        playTrack(createDemoHud(), 'neon'),
        TAPE_WINDOW,
        TAPE_LABEL,
      ),
    ).toMatchObject({ text: `${TEXT_HEART} NEON RAIN` });
  });

  it('should return the hint in the readout when no track has the id', () => {
    expect(
      findHudWidget(
        playTrack(createDemoHud(), 'nothing'),
        TAPE_WINDOW,
        TAPE_LABEL,
      ),
    ).toMatchObject({ text: TAPE_HINT });
  });

  it('should return the track selected in the list when one is picked', () => {
    expect(
      findHudWidget(playTrack(createDemoHud(), 'neon'), TAPE_WINDOW, TAPE_LIST),
    ).toMatchObject({ selected: 'neon' });
  });

  it('should return nothing selected in the list when no track has the id', () => {
    expect(
      findHudWidget(
        playTrack(createDemoHud(), 'nothing'),
        TAPE_WINDOW,
        TAPE_LIST,
      ),
    ).toMatchObject({ selected: 'nothing' });
  });

  it('should leave the rest of the list alone when a track is picked', () => {
    expect(
      findHudWidget(playTrack(createDemoHud(), 'neon'), TAPE_WINDOW, TAPE_LIST),
    ).toEqual({
      ...findHudWidget(createDemoHud(), TAPE_WINDOW, TAPE_LIST),
      selected: 'neon',
    });
  });
});
