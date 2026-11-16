import { map, max, size } from 'lodash-es';

export const toOverlayWidth = (rows: readonly string[]): number =>
  max(map(rows, size)) ?? 0;
