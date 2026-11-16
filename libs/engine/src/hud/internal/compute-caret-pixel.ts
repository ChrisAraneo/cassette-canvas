import { match } from 'ts-pattern';
import { TRANSPARENT } from '../../palette/consts';

export const computeCaretPixel = (text: number, focused: boolean): number =>
  match(focused)
    .with(true, () => text)
    .otherwise(() => TRANSPARENT);
