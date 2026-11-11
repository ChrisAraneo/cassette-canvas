import type { Light } from './light';

/** All the fields of a light except its id. */
export type LightSettings = Omit<Light, 'id'>;
