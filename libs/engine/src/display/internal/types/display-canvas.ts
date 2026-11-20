import type { DisplaySettings } from '../../types/display-settings';

export interface DisplayCanvas {
  readonly canvas: HTMLCanvasElement;
  readonly settings: DisplaySettings;
}
