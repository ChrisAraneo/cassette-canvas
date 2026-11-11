import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../palette/consts';
import { createScreen } from './create-screen';

describe('createScreen', () => {
  it('should hold no sprites when it makes a screen', () => {
    expect(createScreen(0x91).sprites).toEqual([]);
  });

  it('should hold no lights when it makes a screen', () => {
    expect(createScreen(0x91).lights).toEqual([]);
  });

  it('should fill the screen with the background when one is given', () => {
    expect(createScreen(0x91).background).toBe(0x91);
  });

  it('should leave the background transparent when none is given', () => {
    expect(createScreen().background).toBe(TRANSPARENT);
  });

  it('should set the ambient light when one is given', () => {
    expect(createScreen(0x91, -4).ambient).toBe(-4);
  });

  it('should leave the colors as authored when no ambient light is given', () => {
    expect(createScreen(0x91).ambient).toBe(0);
  });
});
