import type { Light } from '../../../screen/types/light';
import type { FramePixel } from './frame-pixel';

export interface FrameVisiblePixels {
  readonly background: number;
  readonly ambient: number;
  readonly lights: readonly Light[];
  readonly width: number;
  readonly height: number;
  readonly pixels: readonly FramePixel[];
}
