import { describe, expect, it } from 'vitest';

import { computeTextAdvance } from '../../text/compute-text-advance';
import { sliceFieldText } from './slice-field-text';

describe('sliceFieldText', () => {
  it('should return the whole text when it fits', () => {
    expect(sliceFieldText('HI', computeTextAdvance('HI'))).toBe('HI');
  });

  it('should return the text with characters dropped off the front when the whole text does not fit', () => {
    expect(sliceFieldText('HIHI', computeTextAdvance('HI'))).toBe('HI');
  });

  it('should return the end of the text, where the caret is, when only one character fits', () => {
    expect(sliceFieldText('ABCD', computeTextAdvance('D'))).toBe('D');
  });

  it('should return an empty text when there is no room at all', () => {
    expect(sliceFieldText('HI', 0)).toBe('');
  });

  it('should return an empty text when the text is empty, whatever the room', () => {
    expect(sliceFieldText('', -5)).toBe('');
  });
});
