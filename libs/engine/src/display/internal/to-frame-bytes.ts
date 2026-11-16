/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import { size } from 'lodash-es';
import type { Frame } from '../../frame/types/frame';
import { CHANNEL_MAX, TRANSPARENT } from '../../palette/consts';
import type { Palette } from '../../palette/types/palette';
import { BYTES_PER_PIXEL } from '../consts';

const RED_OFFSET = 0;

const GREEN_OFFSET = 1;

const BLUE_OFFSET = 2;

const ALPHA_OFFSET = 3;

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (`flatMap` to four bytes per place, one `match` per place), a
// 320x180 screen took 16.5 ms per frame (Vite bundle, Node 24); as
// `Uint32Array.from` over packed palette colors it still took 5.8 ms. This
// loop takes 0.5 ms. Places the palette does not hold stay clear (all four
// bytes 0). It only changes the typed array it creates itself, and the array
// does not change after it returns it.
export const toFrameBytes = (
  frame: Frame,
  palette: Palette,
): Uint8ClampedArray => {
  const count = size(frame);
  const bytes = new Uint8ClampedArray(count * BYTES_PER_PIXEL);

  for (let index = 0; index < count; index += 1) {
    const rgb = palette[frame[index] ?? TRANSPARENT];

    if (rgb !== undefined) {
      const offset = index * BYTES_PER_PIXEL;

      bytes[offset + RED_OFFSET] = rgb.red;
      bytes[offset + GREEN_OFFSET] = rgb.green;
      bytes[offset + BLUE_OFFSET] = rgb.blue;
      bytes[offset + ALPHA_OFFSET] = CHANNEL_MAX;
    }
  }

  return bytes;
};
