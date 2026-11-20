import { inRange, isInteger } from 'lodash-es';

export const isIndex = (index: number, count: number): boolean =>
  isInteger(index) && inRange(index, count);
