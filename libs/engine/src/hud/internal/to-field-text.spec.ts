import { describe, expect, it } from 'vitest';

import { measureText } from '../../text/measure-text';
import { toFieldText } from './to-field-text';

describe('toFieldText', () => {
  it('should keep the whole text when it fits', () => {
    expect(toFieldText('HI', measureText('HI'))).toBe('HI');
  });

  it('should drop characters off the front until the rest fits', () => {
    expect(toFieldText('HIHI', measureText('HI'))).toBe('HI');
  });

  it('should keep the end of the text, where the caret is', () => {
    expect(toFieldText('ABCD', measureText('D'))).toBe('D');
  });

  it('should give nothing when there is no room at all', () => {
    expect(toFieldText('HI', 0)).toBe('');
  });

  it('should give nothing for an empty text, whatever the room', () => {
    expect(toFieldText('', -5)).toBe('');
  });
});
