import type { Rgb } from '../types/rgb';
import { computeChannelMix } from './compute-channel-mix';

export const computeRgbMix = (base: Rgb, target: Rgb, amount: number): Rgb => ({
  red: computeChannelMix(base.red, target.red, amount),
  green: computeChannelMix(base.green, target.green, amount),
  blue: computeChannelMix(base.blue, target.blue, amount),
});
