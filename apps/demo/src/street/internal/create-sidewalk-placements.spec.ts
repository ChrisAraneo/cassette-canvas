import type { SpritePlacement } from '@cassette-canvas/engine';
import { every, filter, size, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LAMP_POST, TREE } from '../../art/street/consts';
import { SPRITE_SIZE } from '../../consts';
import { LAMP_COLUMNS, SCREEN_WIDTH, TREE_COLUMNS } from '../consts';
import { createSidewalkPlacements } from './create-sidewalk-placements';

const withPrefix = (prefix: string): SpritePlacement[] =>
  filter(createSidewalkPlacements(), ({ id }) => startsWith(id, prefix));

describe('createSidewalkPlacements', () => {
  it('should pave two rows of tiles across the screen', () => {
    expect(size(withPrefix('sidewalk-'))).toBe(
      (2 * SCREEN_WIDTH) / SPRITE_SIZE,
    );
  });

  it('should plant every tree when it lays the sidewalk', () => {
    expect(size(withPrefix('tree-'))).toBe(size(TREE_COLUMNS) * size(TREE));
  });

  it('should make the trees cast shadows when it plants them', () => {
    expect(every(withPrefix('tree-'), { castsShadow: true })).toBe(true);
  });

  it('should put up every lamp post when it lays the sidewalk', () => {
    expect(size(withPrefix('lamp-'))).toBe(
      size(LAMP_COLUMNS) * size(LAMP_POST),
    );
  });

  it('should keep the lamp posts from blocking their own light when it puts them up', () => {
    expect(every(withPrefix('lamp-'), { castsShadow: false })).toBe(true);
  });

  it('should draw the pavement before the trees and the lamps', () => {
    expect(startsWith(createSidewalkPlacements()[0]?.id, 'sidewalk-')).toBe(
      true,
    );
  });
});
