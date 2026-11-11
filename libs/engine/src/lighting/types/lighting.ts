import type { Light } from '../../screen/types/light';

export interface Lighting {
  readonly ambient: number;
  readonly lights: readonly Light[];
  readonly width: number;
  readonly height: number;
  readonly occluders: Readonly<Record<number, boolean>>;
}
