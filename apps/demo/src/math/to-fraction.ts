import { floor } from 'lodash-es';

/**
 * Returns the part of a number after the decimal point: `2.25` returns
 * `0.25`.
 */
export const toFraction = (value: number): number => value - floor(value);
