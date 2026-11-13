import { find } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Hud } from '../types/hud';
import { filterOtherWindows } from './filter-other-windows';

const { nonNullable } = P;

/**
 * Puts the window with the id on top of the others, keeping the order of the
 * rest. If no window has the id, nothing changes.
 */
export const raiseHudWindow = (hud: Hud, id: string): Hud =>
  match(find(hud.windows, (window) => window.id === id))
    .with(nonNullable, (window) => ({
      ...hud,
      windows: [...filterOtherWindows(hud.windows, id), window],
    }))
    .otherwise(() => hud);
