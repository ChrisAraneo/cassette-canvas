import { every, map, size, slice } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FACADE_LEGENDS, LIT_SHOP } from '../../art/city/consts';
import { SPRITE_SIZE } from '../../consts';
import {
  SHOP_HOURS,
  SIDEWALK_ROW,
  WINDOW_BEDTIME,
  WINDOW_DUSK,
} from '../consts';
import { createLitWindows } from './create-lit-windows';

const HOUSE = Object.freeze({
  id: 'house',
  column: 16,
  legend: FACADE_LEGENDS.pink,
  grid: ['cccc', 'WxWx', 'VxVx', 'SSDx', 'TTEx'],
});

const HOME_WINDOWS = slice(createLitWindows([HOUSE]), 0, 2);

describe('createLitWindows', () => {
  it('should return every home window and every shop window when it looks at the facade', () => {
    expect(size(createLitWindows([HOUSE]))).toBe(4);
  });

  it('should return the glow over the window when it lights a window', () => {
    expect(
      map(createLitWindows([HOUSE])[1]?.placements, ({ row, column }) => [
        row,
        column,
      ]),
    ).toEqual([
      [SIDEWALK_ROW - 4 * SPRITE_SIZE, 16 + 2 * SPRITE_SIZE],
      [SIDEWALK_ROW - 3 * SPRITE_SIZE, 16 + 2 * SPRITE_SIZE],
    ]);
  });

  it('should return the home windows lit one by one when night falls', () => {
    expect(
      every(
        HOME_WINDOWS,
        ({ dusk }) => dusk >= WINDOW_DUSK.from && dusk <= WINDOW_DUSK.to,
      ),
    ).toBe(true);
  });

  it('should return a bedtime between 21:00 and 3:00 for every home window when it lights them', () => {
    expect(
      every(
        HOME_WINDOWS,
        ({ bedtime }) =>
          bedtime >= WINDOW_BEDTIME.from && bedtime <= WINDOW_BEDTIME.to,
      ),
    ).toBe(true);
  });

  it('should return the shop hours when it lights a shop window', () => {
    const shop = createLitWindows([HOUSE])[2];

    expect([shop?.dusk, shop?.bedtime]).toEqual([
      SHOP_HOURS.dusk,
      SHOP_HOURS.bedtime,
    ]);
    expect(map(shop?.placements, 'sprite')).toEqual(map(LIT_SHOP, 'sprite'));
  });

  it('should return no windows when there are no buildings', () => {
    expect(createLitWindows([])).toEqual([]);
  });
});
