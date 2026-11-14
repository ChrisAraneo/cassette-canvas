import { describe, expect, it } from 'vitest';

import { measureText } from '../../text/measure-text';
import { toListText } from './to-list-text';

describe('toListText', () => {
  it('should return the whole text when it fits in the room it has', () => {
    expect(toListText('SIDE A', measureText('SIDE A'))).toBe('SIDE A');
  });

  it('should return the start of the text when it is too long for the room', () => {
    expect(toListText('SIDE A', measureText('SIDE'))).toBe('SIDE');
  });

  it('should return as much as fits when the room ends inside a character', () => {
    expect(toListText('SIDE A', measureText('SID') + 1)).toBe('SID');
  });

  it('should return an empty text when there is no room at all', () => {
    expect(toListText('SIDE A', 0)).toBe('');
  });

  it('should return an empty text when the text is empty', () => {
    expect(toListText('', 20)).toBe('');
  });
});
