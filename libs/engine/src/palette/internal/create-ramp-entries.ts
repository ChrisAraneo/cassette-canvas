import { createColorEntries } from './create-color-entries';
import { createColorPixels } from './create-color-pixels';
import type { ShadeRampEntry } from './types/shade-ramp-entry';

export const createRampEntries = (color: number): ShadeRampEntry[] =>
  createColorEntries(color, createColorPixels(color));
