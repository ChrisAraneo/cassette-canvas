import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import { computeWindowPlace } from './compute-window-place';

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

describe('computeWindowPlace', () => {
  it('should return the place it is given when the whole window fits there', () => {
    expect(computeWindowPlace(createSizedHud(), 'street', 10, 20)).toEqual({
      row: 10,
      column: 20,
    });
  });

  it('should return the top edge when the place is above the screen', () => {
    expect(computeWindowPlace(createSizedHud(), 'street', -8, 20)).toEqual({
      row: 0,
      column: 20,
    });
  });

  it('should return the left edge when the place is left of the screen', () => {
    expect(computeWindowPlace(createSizedHud(), 'street', 10, -30)).toEqual({
      row: 10,
      column: 0,
    });
  });

  it('should return the bottom edge when the place is below the screen', () => {
    expect(computeWindowPlace(createSizedHud(), 'street', 200, 20)).toEqual({
      row: 90 - 76,
      column: 20,
    });
  });

  it('should return the right edge when the place is right of the screen', () => {
    expect(computeWindowPlace(createSizedHud(), 'street', 10, 400)).toEqual({
      row: 10,
      column: 160 - 90,
    });
  });

  it('should return the top-left pixel when the window is larger than the screen', () => {
    expect(
      computeWindowPlace(
        createStreetHud(createHud(undefined, { width: 40, height: 30 })),
        'street',
        10,
        20,
      ),
    ).toEqual({ row: 0, column: 0 });
  });

  it('should return the place it is given when the HUD is on no screen of a known size', () => {
    expect(
      computeWindowPlace(createStreetHud(createHud()), 'street', -8, -30),
    ).toEqual({ row: -8, column: -30 });
  });

  it('should return the place it is given when no window has the id', () => {
    expect(computeWindowPlace(createSizedHud(), 'note', -8, -30)).toEqual({
      row: -8,
      column: -30,
    });
  });
});
