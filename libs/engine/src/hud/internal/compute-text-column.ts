import { floor } from 'lodash-es';
import type { HudRect } from '../types/hud-rect';
import { computeTextWidth } from './compute-text-width';

export const computeTextColumn = (
  rect: HudRect,
  text: string,
  shift: number,
): number =>
  rect.column + floor((rect.width - computeTextWidth(text)) / 2) + shift;
