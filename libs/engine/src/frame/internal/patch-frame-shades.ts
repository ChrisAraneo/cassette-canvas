import { zipWith } from 'lodash-es';
import { toLitPixel } from '../../palette/to-lit-pixel';
import type { Frame } from '../types/frame';
import type { FrameLight } from './types/frame-light';

export const patchFrameShades = ({ pixels, levels }: FrameLight): Frame =>
  zipWith(pixels, levels, toLitPixel);
