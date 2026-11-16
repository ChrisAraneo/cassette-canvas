import { map, range } from 'lodash-es';
import { EXTENDED_SHADE_COUNT } from '../consts';
import { toExtendedPixel } from '../to-extended-pixel';

export const createColorPixels = (color: number): number[] =>
  map(range(EXTENDED_SHADE_COUNT), (extendedShade) =>
    toExtendedPixel(color, extendedShade),
  );
