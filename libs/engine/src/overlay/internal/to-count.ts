import { floor } from 'lodash-es';

/**
 * Turns a width or a height into a count of logical pixels: whole pixels
 * only, and never less than none.
 */
export const toCount = (value: number): number => Math.max(0, floor(value));
