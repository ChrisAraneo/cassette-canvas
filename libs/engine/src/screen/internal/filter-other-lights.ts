import { filter } from 'lodash-es';
import type { Light } from '../types/light';

export const filterOtherLights = (
  lights: readonly Light[],
  id: string,
): Light[] => filter(lights, (light) => light.id !== id);
