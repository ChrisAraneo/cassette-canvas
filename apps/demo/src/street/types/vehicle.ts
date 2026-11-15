import type { HeadlightOffset } from './headlight-offset';
import type { Mover } from './mover';

/** A mover with a headlight that shines at night. */
export interface Vehicle extends Mover {
  /** Where the headlight is, from the top-left pixel of the vehicle. */
  readonly headlight: HeadlightOffset;
}
