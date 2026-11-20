import { match } from 'ts-pattern';
import { TRANSPARENT } from '../../palette/consts';

export const computeCaretPixel = (pixel: number, focused: boolean): number =>
  match(focused)
    .with(true, () => pixel)
    .otherwise(() => TRANSPARENT);
