import { filter } from 'lodash-es';
import type { OverlayPlacement } from '../types/overlay-placement';

export const filterOtherOverlays = (
  overlays: readonly OverlayPlacement[],
  id: string,
): OverlayPlacement[] => filter(overlays, (placement) => placement.id !== id);
