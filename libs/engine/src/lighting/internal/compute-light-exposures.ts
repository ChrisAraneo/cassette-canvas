import { map } from 'lodash-es';
import type { Lighting } from '../types/lighting';
import { computeLightExposure } from './compute-light-exposure';
import type { LightExposures } from './types/light-exposures';

/**
 * Returns how much light every light of the scene adds to every pixel, one
 * field per light, in the order the scene holds them. The fields are amounts
 * of light rather than extended shades, because that is what adds up.
 */
export const computeLightExposures = ({
  ambient,
  lights,
  width,
  height,
  occluders,
}: Lighting): LightExposures => ({
  ambient,
  width,
  height,
  exposures: map(lights, (light) =>
    computeLightExposure({ ambient, lights, width, height, occluders }, light),
  ),
});
