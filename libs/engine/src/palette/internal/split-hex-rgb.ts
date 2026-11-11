import { map, parseInt, words } from 'lodash-es';
import { pipe } from 'remeda';
import type { Rgb } from '../types/rgb';

const HEX_CHANNEL_PATTERN = /[\da-f]{2}/gi;

const HEX_RADIX = 16;

export const splitHexRgb = (color: string): Rgb =>
  pipe(
    words(color, HEX_CHANNEL_PATTERN),
    (channels) => map(channels, (channel) => parseInt(channel, HEX_RADIX)),
    ([red = 0, green = 0, blue = 0]) => ({ red, green, blue }),
  );
