import type { HudRect } from '../types/hud-rect';

/** Returns the rectangle `amount` pixels inside the one given. */
export const insetRect = (
  { row, column, width, height }: HudRect,
  amount: number,
): HudRect => ({
  row: row + amount,
  column: column + amount,
  width: width - 2 * amount,
  height: height - 2 * amount,
});
