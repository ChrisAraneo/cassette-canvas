import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import { isFocused } from './is-focused';

const createTypingHud = (): Hud => ({
  ...createHud(),
  focus: { window: 'notes', widget: 'note' },
});

describe('isFocused', () => {
  it('should find the field that takes the keys', () => {
    expect(isFocused(createTypingHud(), 'notes', 'note')).toBe(true);
  });

  it('should not find another widget of the same window', () => {
    expect(isFocused(createTypingHud(), 'notes', 'title')).toBe(false);
  });

  it('should not find a widget of another window', () => {
    expect(isFocused(createTypingHud(), 'street', 'note')).toBe(false);
  });

  it('should find nothing when no field has the keys', () => {
    expect(isFocused(createHud(), 'notes', 'note')).toBe(false);
  });
});
