import { filter } from 'lodash-es';
import type { HudWindow } from '../types/hud-window';

export const filterOtherWindows = (
  windows: readonly HudWindow[],
  id: string,
): HudWindow[] => filter(windows, (window) => window.id !== id);
