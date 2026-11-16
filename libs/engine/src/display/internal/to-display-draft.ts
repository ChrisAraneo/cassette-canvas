import { tryCreateCrt } from '../../crt/try-create-crt';
import { createPalette } from '../../palette/create-palette';
import { DEFAULT_MAX_FPS } from '../consts';
import type { DisplaySettings } from '../types/display-settings';
import type { DisplayDraft } from './types/display-draft';
import type { DisplaySize } from './types/display-size';

export const toDisplayDraft = (
  context: WebGLRenderingContext | undefined,
  size: DisplaySize,
  { colors, pixelSize, spriteSize, fps = DEFAULT_MAX_FPS }: DisplaySettings,
): DisplayDraft => ({
  context,
  crt: tryCreateCrt(context),
  palette: createPalette(colors),
  pixelSize,
  spriteSize,
  width: size.width,
  height: size.height,
  fps,
  drawnAt: Number.NEGATIVE_INFINITY,
});
