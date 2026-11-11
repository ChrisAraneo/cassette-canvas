import { toLitPixels } from '../../palette/to-lit-pixels';
import type { Frame } from '../types/frame';
import type { FrameLight } from './types/frame-light';

export const patchFrameShades = ({ pixels, levels }: FrameLight): Frame =>
  toLitPixels(pixels, levels);
