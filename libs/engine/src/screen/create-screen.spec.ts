import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../palette/consts';
import { createScreen } from './create-screen';

describe('createScreen', () => {
  it('should return no sprites when it makes a screen', () => {
    expect(createScreen(0x91).sprites).toEqual([]);
  });

  it('should return no lights when it makes a screen', () => {
    expect(createScreen(0x91).lights).toEqual([]);
  });

  it('should return the background when one is given', () => {
    expect(createScreen(0x91).background).toBe(0x91);
  });

  it('should return a transparent background when none is given', () => {
    expect(createScreen().background).toBe(TRANSPARENT);
  });

  it('should return the ambient light when one is given', () => {
    expect(createScreen(0x91, -4).ambient).toBe(-4);
  });

  it('should return an ambient light of 0 when none is given', () => {
    expect(createScreen(0x91).ambient).toBe(0);
  });
});
