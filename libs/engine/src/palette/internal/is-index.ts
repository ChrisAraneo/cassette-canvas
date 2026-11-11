import { inRange, isInteger } from 'lodash-es';

export const isIndex = (index: number, size: number): boolean =>
  isInteger(index) && inRange(index, size);
