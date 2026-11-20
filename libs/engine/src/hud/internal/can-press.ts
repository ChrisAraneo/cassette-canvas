import type { HudPlacedWidget } from './types/hud-placed-widget';

export const canPress = ({ widget, item }: HudPlacedWidget): boolean =>
  item === '' || widget.kind === 'BUTTON';
