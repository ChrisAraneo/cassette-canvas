import { match } from 'ts-pattern';
import type { HudList } from '../types/hud-list';
import type { HudTheme } from '../types/hud-theme';
import { isSelected } from './is-selected';
import type { HudListPlacement } from './types/hud-list-placement';

export const toItemShade = (
  placement: HudListPlacement,
  widget: HudList,
  theme: HudTheme,
): number =>
  match(isSelected(placement, widget))
    .with(true, () => theme.highlight)
    .otherwise(() => theme.text);
