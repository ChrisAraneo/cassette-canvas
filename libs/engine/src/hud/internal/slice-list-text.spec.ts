import { describe, expect, it } from 'vitest';

import { computeTextAdvance } from '../../text/compute-text-advance';
import { sliceListText } from './slice-list-text';

describe('sliceListText', () => {
  it('should return the whole text when it fits in the room it has', () => {
    expect(sliceListText('SIDE A', computeTextAdvance('SIDE A'))).toBe(
      'SIDE A',
    );
  });

  it('should return the start of the text when it is too long for the room', () => {
    expect(sliceListText('SIDE A', computeTextAdvance('SIDE'))).toBe('SIDE');
  });

  it('should return as much as fits when the room ends inside a character', () => {
    expect(sliceListText('SIDE A', computeTextAdvance('SID') + 1)).toBe('SID');
  });

  it('should return an empty text when there is no room at all', () => {
    expect(sliceListText('SIDE A', 0)).toBe('');
  });

  it('should return an empty text when the text is empty', () => {
    expect(sliceListText('', 20)).toBe('');
  });
});
