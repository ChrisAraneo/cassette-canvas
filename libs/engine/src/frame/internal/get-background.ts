import { match } from 'ts-pattern';
import { TRANSPARENT } from '../../palette/consts';
import { isPixel } from '../../palette/is-pixel';
import type { Screen } from '../../screen/types/screen';

export const getBackground = ({ background }: Screen): number =>
  match(isPixel(background))
    .with(true, () => background)
    .otherwise(() => TRANSPARENT);
