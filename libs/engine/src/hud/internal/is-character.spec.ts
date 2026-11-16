import { describe, expect, it } from 'vitest';

import { HUD_BACKSPACE_KEY } from '../consts';
import { isCharacter } from './is-character';

describe('isCharacter', () => {
  it('should hold when the key types one letter', () => {
    expect(isCharacter('a')).toBe(true);
  });

  it('should hold when the key types a space', () => {
    expect(isCharacter(' ')).toBe(true);
  });

  it('should not hold when the key is named rather than typed', () => {
    expect(isCharacter(HUD_BACKSPACE_KEY)).toBe(false);
  });

  it('should not hold when there is no key at all', () => {
    expect(isCharacter('')).toBe(false);
  });
});
