import { map, max, size } from 'lodash-es';

export const toArtWidth = (art: readonly string[]): number =>
  max(map(art, size)) ?? 0;
