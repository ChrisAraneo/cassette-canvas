import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import { isFocused } from './is-focused';

const createTypingHud = (): Hud => ({
  ...createHud(),
  focus: { window: 'notes', widget: 'note' },
});

describe('isFocused', () => {
  it('should return true when the field takes the keys', () => {
    expect(isFocused(createTypingHud(), 'notes', 'note')).toBe(true);
  });

  it('should return false when the widget is another one of the same window', () => {
    expect(isFocused(createTypingHud(), 'notes', 'title')).toBe(false);
  });

  it('should return false when the widget belongs to another window', () => {
    expect(isFocused(createTypingHud(), 'street', 'note')).toBe(false);
  });

  it('should return false when no field has the keys', () => {
    expect(isFocused(createHud(), 'notes', 'note')).toBe(false);
  });
});
