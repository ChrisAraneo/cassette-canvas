import { find, first } from 'lodash-es';
import { match } from 'ts-pattern';
import type { HudWidget } from '../types/hud-widget';

/**
 * Returns the page a window opens on: the first tab of its first tab strip,
 * or an empty page when it has no tabs.
 */
export const computeFirstPage = (widgets: readonly HudWidget[]): string =>
  match(find(widgets, (widget) => widget.kind === 'tabs'))
    .with({ kind: 'tabs' }, (strip) => first(strip.tabs)?.id ?? '')
    .otherwise(() => '');
