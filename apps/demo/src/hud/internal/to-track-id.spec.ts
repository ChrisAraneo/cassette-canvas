import { describe, expect, it } from 'vitest';

import { PLAY_BUTTON, TAPE_LIST } from '../consts';
import { toTrackId } from './to-track-id';

describe('toTrackId', () => {
  it('should return the track when the widget is the play button of one', () => {
    expect(toTrackId(`${PLAY_BUTTON}-neon`)).toBe('neon');
  });

  it('should return no track at all when the widget is not a play button', () => {
    expect(toTrackId(TAPE_LIST)).toBe('');
  });

  it('should return no track at all when the widget has no id', () => {
    expect(toTrackId('')).toBe('');
  });
});
