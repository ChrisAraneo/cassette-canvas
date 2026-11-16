import { match } from 'ts-pattern';
import { HUD_PRESS_SHIFT } from '../consts';

export const computePressShift = (held: boolean): number =>
  match(held)
    .with(true, () => HUD_PRESS_SHIFT)
    .otherwise(() => 0);
