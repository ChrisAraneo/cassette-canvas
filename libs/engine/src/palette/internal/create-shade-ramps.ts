import { flatMap, fromPairs, range } from 'lodash-es';
import { pipe } from 'remeda';
import { COLOR_COUNT } from '../consts';
import { createRampEntries } from './create-ramp-entries';
import type { ShadeRamps } from './types/shade-ramps';

export const createShadeRamps = (): ShadeRamps =>
  pipe(
    range(COLOR_COUNT),
    (colors) => flatMap(colors, createRampEntries),
    fromPairs,
  );
