import { match } from 'ts-pattern';
import type { OverlayChanges } from '../types/overlay-changes';
import type { OverlayPlacement } from '../types/overlay-placement';

export const patchOverlayPlacement = (
  placement: OverlayPlacement,
  id: string,
  changes: OverlayChanges,
): OverlayPlacement =>
  match(placement.id === id)
    .with(true, () => ({
      id,
      overlay: changes.overlay ?? placement.overlay,
      row: changes.row ?? placement.row,
      column: changes.column ?? placement.column,
    }))
    .otherwise(() => placement);
