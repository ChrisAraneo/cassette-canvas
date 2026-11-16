import { round } from 'lodash-es';

export const computeChannelMix = (
  channel: number,
  target: number,
  amount: number,
): number => round(channel + (target - channel) * amount);
