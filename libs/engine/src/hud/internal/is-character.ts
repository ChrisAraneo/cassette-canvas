import { size } from 'lodash-es';

export const isCharacter = (key: string): boolean => size(key) === 1;
