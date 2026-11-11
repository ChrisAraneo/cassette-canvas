import { match } from 'ts-pattern';
import type { Light } from '../types/light';
import type { LightChanges } from '../types/light-changes';

export const patchMatchingLight = (
  light: Light,
  id: string,
  changes: LightChanges,
): Light =>
  match(light.id === id)
    .with(true, () => ({
      id,
      row: changes.row ?? light.row,
      column: changes.column ?? light.column,
      radius: changes.radius ?? light.radius,
      intensity: changes.intensity ?? light.intensity,
    }))
    .otherwise(() => light);
