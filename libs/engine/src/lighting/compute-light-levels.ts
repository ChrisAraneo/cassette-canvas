import { map, sumBy, times } from 'lodash-es';
import { computeLightField } from './internal/compute-light-field';
import type { Lighting } from './types/lighting';

const computeFieldLevels = (
  { ambient, width, height }: Lighting,
  fields: readonly Float32Array[],
): number[] =>
  times(
    width * height,
    (index) => ambient + sumBy(fields, (field) => field[index] ?? 0),
  );

export const computeLightLevels = (lighting: Lighting): number[] =>
  computeFieldLevels(
    lighting,
    map(lighting.lights, (light) => computeLightField(lighting, light)),
  );
