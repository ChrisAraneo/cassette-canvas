import type { Lighting } from '../../../lighting/types/lighting';

export interface FrameEdits {
  readonly background: number;
  readonly size: number;
  readonly edits: Readonly<Record<number, number>>;
  readonly lighting: Lighting;
}
