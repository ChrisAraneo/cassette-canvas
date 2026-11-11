import { find } from 'lodash-es';
import type { Light } from './types/light';
import type { Screen } from './types/screen';

/** Returns the light with the id, or `undefined` if there is none. */
export const findLight = (screen: Screen, id: string): Light | undefined =>
  find(screen.lights, (light) => light.id === id);
