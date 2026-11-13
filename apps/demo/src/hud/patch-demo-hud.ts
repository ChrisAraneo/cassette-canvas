import { type Hud, patchHudWidget } from '@cassette-canvas/engine';
import { pipe } from 'remeda';
import { computeSunHeight } from '../day/compute-sun-height';
import type { DayCycle } from '../day/types/day-cycle';
import { formatClock } from '../format/format-clock';
import { formatFps } from '../format/format-fps';
import { formatHeight } from '../format/format-height';
import { formatPercent } from '../format/format-percent';
import {
  CLOCK_WIDGET,
  DARKNESS_LABEL,
  DARKNESS_WIDGET,
  FPS_LABEL,
  FPS_WIDGET,
  STREET_WINDOW,
  SUN_LABEL,
  SUN_WIDGET,
  TIME_LABEL,
} from './consts';

/**
 * Writes the readouts of the street window: the frame rate and the clock on
 * the time page, how dark it is and how high the sun is on the sky page.
 * Both pages are written on every frame, so a page is right the moment its
 * tab opens. Returns a new HUD.
 */
export const patchDemoHud = (hud: Hud, fps: number, cycle: DayCycle): Hud =>
  pipe(
    hud,
    (current) =>
      patchHudWidget(current, STREET_WINDOW, FPS_WIDGET, {
        text: `${FPS_LABEL} ${formatFps(fps)}`,
      }),
    (current) =>
      patchHudWidget(current, STREET_WINDOW, CLOCK_WIDGET, {
        text: `${TIME_LABEL} ${formatClock(cycle.phase)}`,
      }),
    (current) =>
      patchHudWidget(current, STREET_WINDOW, DARKNESS_WIDGET, {
        text: `${DARKNESS_LABEL} ${formatPercent(cycle.darkness)}`,
      }),
    (current) =>
      patchHudWidget(current, STREET_WINDOW, SUN_WIDGET, {
        text: `${SUN_LABEL} ${formatHeight(computeSunHeight(cycle.phase))}`,
      }),
  );
