import { round } from 'lodash-es';
import type { Rgb } from '../types/rgb';

const computeChannelMix = (
  channel: number,
  target: number,
  amount: number,
): number => round(channel + (target - channel) * amount);

export const computeRgbMix = (
  color: Rgb,
  target: Rgb,
  amount: number,
): Rgb => ({
  red: computeChannelMix(color.red, target.red, amount),
  green: computeChannelMix(color.green, target.green, amount),
  blue: computeChannelMix(color.blue, target.blue, amount),
});
