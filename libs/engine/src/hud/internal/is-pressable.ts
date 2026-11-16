import type { HudPlacedWidget } from './types/hud-placed-widget';

export const isPressable = ({ widget, item }: HudPlacedWidget): boolean =>
  item === '' || widget.kind === 'BUTTON';
