import { CRT_CONTEXT_ATTRIBUTES } from '../../crt/consts';
import type { DisplayCanvas } from './types/display-canvas';
import type { DisplayContext } from './types/display-context';

export const initializeDisplayContext = ({
  canvas,
  settings,
}: DisplayCanvas): DisplayContext => ({
  canvas,
  settings,
  context: canvas.getContext('webgl', CRT_CONTEXT_ATTRIBUTES) ?? undefined,
});
