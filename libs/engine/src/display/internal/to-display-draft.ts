import { tryCreateCrt } from '../../crt/try-create-crt';
import { createPalette } from '../../palette/create-palette';
import { DEFAULT_MAX_FPS } from '../consts';
import { computeDisplaySize } from './compute-display-size';
import type { DisplayContext } from './types/display-context';
import type { DisplayDraft } from './types/display-draft';

export const toDisplayDraft = ({
  canvas,
  settings,
  context,
}: DisplayContext): DisplayDraft => ({
  context,
  crt: tryCreateCrt(context),
  palette: createPalette(settings.colors),
  pixelSize: settings.pixelSize,
  spriteSize: settings.spriteSize,
  ...computeDisplaySize(canvas, settings.pixelSize),
  fps: settings.fps ?? DEFAULT_MAX_FPS,
  drawnAt: Number.NEGATIVE_INFINITY,
});
