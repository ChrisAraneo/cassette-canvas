import { match } from 'ts-pattern';
import { HUD_CARET_WIDTH } from '../consts';

export const computeCaretWidth = (focused: boolean): number =>
  match(focused)
    .with(true, () => HUD_CARET_WIDTH)
    .otherwise(() => 0);
