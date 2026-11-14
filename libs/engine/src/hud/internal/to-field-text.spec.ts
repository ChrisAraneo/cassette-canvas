import { describe, expect, it } from 'vitest';

import { measureText } from '../../text/measure-text';
import { toFieldText } from './to-field-text';

describe('toFieldText', () => {
  it('should return the whole text when it fits', () => {
    expect(toFieldText('HI', measureText('HI'))).toBe('HI');
  });

  it('should return the text with characters dropped off the front when the whole text does not fit', () => {
    expect(toFieldText('HIHI', measureText('HI'))).toBe('HI');
  });

  it('should return the end of the text, where the caret is, when only one character fits', () => {
    expect(toFieldText('ABCD', measureText('D'))).toBe('D');
  });

  it('should return an empty text when there is no room at all', () => {
    expect(toFieldText('HI', 0)).toBe('');
  });

  it('should return an empty text when the text is empty, whatever the room', () => {
    expect(toFieldText('', -5)).toBe('');
  });
});
