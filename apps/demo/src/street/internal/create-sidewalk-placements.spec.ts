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
  it('should return two rows of tiles across the screen when it places the sidewalk', () => {
    expect(size(withPrefix('sidewalk-'))).toBe(
      (2 * SCREEN_WIDTH) / SPRITE_SIZE,
    );
  });

  it('should return every tree when it lays the sidewalk', () => {
    expect(size(withPrefix('tree-'))).toBe(size(TREE_COLUMNS) * size(TREE));
  });

  it('should return the trees as shadow casters when it plants them', () => {
    expect(every(withPrefix('tree-'), { castsShadow: true })).toBe(true);
  });

  it('should return every lamp post when it lays the sidewalk', () => {
    expect(size(withPrefix('lamp-'))).toBe(
      size(LAMP_COLUMNS) * size(LAMP_POST),
    );
  });

  it('should return the lamp posts as no shadow casters when it places the sidewalk, so they do not block their own light', () => {
    expect(every(withPrefix('lamp-'), { castsShadow: false })).toBe(true);
  });

  it('should return the pavement before the trees and the lamps when it places the sidewalk', () => {
    expect(startsWith(createSidewalkPlacements()[0]?.id, 'sidewalk-')).toBe(
      true,
    );
  });
});
