import { clamp } from 'lodash-es';
import { LAMPS_ON } from '../consts';

/**
 * Returns how bright the lamps and headlights are, from 0 (off) to 1 (fully
 * on). They go on as dusk falls and off as dawn breaks.
 */
export const computeLampLevel = (darkness: number): number =>
  clamp((darkness - LAMPS_ON.from) / (LAMPS_ON.to - LAMPS_ON.from), 0, 1);
