import { match, P } from 'ts-pattern';
import { BLACK } from '../consts';
import type { HexColor } from '../types/hex-color';
import type { Rgb } from '../types/rgb';
import { splitHexRgb } from './split-hex-rgb';

const { string } = P;

const HEX_COLOR_PATTERN = /^#[\da-f]{6}$/i;

export const toRgb = (color: HexColor): Rgb =>
  match(color)
    .with(string.regex(HEX_COLOR_PATTERN), splitHexRgb)
    .otherwise(() => BLACK);
