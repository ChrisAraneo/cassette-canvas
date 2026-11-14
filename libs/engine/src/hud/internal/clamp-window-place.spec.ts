import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import { clampWindowPlace } from './clamp-window-place';

/** A screen 160 by 90 pixels, with a window 90 by 76 on it. */
const createStreetHud = (hud: Hud): Hud =>
  addHudWindow(hud, {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 76,
  });

const createSizedHud = (): Hud =>
  createStreetHud(createHud(undefined, { width: 160, height: 90 }));

describe('clampWindowPlace', () => {
  it('should return the place it is given when the whole window fits there', () => {
    expect(clampWindowPlace(createSizedHud(), 'street', 10, 20)).toEqual({
      row: 10,
      column: 20,
    });
  });

  it('should return the top edge when the place is above the screen', () => {
    expect(clampWindowPlace(createSizedHud(), 'street', -8, 20)).toEqual({
      row: 0,
      column: 20,
    });
  });

  it('should return the left edge when the place is left of the screen', () => {
    expect(clampWindowPlace(createSizedHud(), 'street', 10, -30)).toEqual({
      row: 10,
      column: 0,
    });
  });

  it('should return the bottom edge when the place is below the screen', () => {
    expect(clampWindowPlace(createSizedHud(), 'street', 200, 20)).toEqual({
      row: 90 - 76,
      column: 20,
    });
  });

  it('should return the right edge when the place is right of the screen', () => {
    expect(clampWindowPlace(createSizedHud(), 'street', 10, 400)).toEqual({
      row: 10,
      column: 160 - 90,
    });
  });

  it('should return the top-left pixel when the window is larger than the screen', () => {
    expect(
      clampWindowPlace(
        createStreetHud(createHud(undefined, { width: 40, height: 30 })),
        'street',
        10,
        20,
      ),
    ).toEqual({ row: 0, column: 0 });
  });

  it('should return the place it is given when the HUD is on no screen of a known size', () => {
    expect(
      clampWindowPlace(createStreetHud(createHud()), 'street', -8, -30),
    ).toEqual({ row: -8, column: -30 });
  });

  it('should return the place it is given when no window has the id', () => {
    expect(clampWindowPlace(createSizedHud(), 'note', -8, -30)).toEqual({
      row: -8,
      column: -30,
    });
  });
});
