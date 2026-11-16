import { dropRight, join, split } from 'lodash-es';

export const sliceWithoutLast = (text: string): string =>
  join(dropRight(split(text, ''), 1), '');
