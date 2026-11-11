import { map } from 'lodash-es';
import { computeFieldLevels } from './internal/compute-field-levels';
import { computeLightField } from './internal/compute-light-field';
import type { Lighting } from './types/lighting';

export const computeLightLevels = (lighting: Lighting): Float64Array =>
  computeFieldLevels(
    lighting,
    map(lighting.lights, (light) => computeLightField(lighting, light)),
  );
