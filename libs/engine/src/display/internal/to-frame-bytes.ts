import { flatMap } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Frame } from '../../frame/types/frame';
import { CHANNEL_MAX } from '../../palette/consts';
import type { Palette } from '../../palette/types/palette';
import type { Rgb } from '../../palette/types/rgb';

const { nonNullable } = P;

const CLEAR_BYTES: readonly number[] = Object.freeze([0, 0, 0, 0]);

const toPixelBytes = (rgb: Rgb | undefined): readonly number[] =>
  match(rgb)
    .with(nonNullable, ({ red, green, blue }) => [
      red,
      green,
      blue,
      CHANNEL_MAX,
    ])
    .otherwise(() => CLEAR_BYTES);

export const toFrameBytes = (
  frame: Frame,
  palette: Palette,
): Uint8ClampedArray =>
  Uint8ClampedArray.from(
    flatMap(frame, (pixel) => toPixelBytes(palette[pixel])),
  );
