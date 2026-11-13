import {
  findHudWidget,
  findHudWindow,
  type Hud,
} from '@cassette-canvas/engine';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import type { DayCycle } from '../day/types/day-cycle';
import {
  CLOCK_WIDGET,
  DARKNESS_WIDGET,
  FPS_WIDGET,
  STREET_WINDOW,
  SUN_WIDGET,
} from './consts';
import { createDemoHud } from './create-demo-hud';
import { patchDemoHud } from './patch-demo-hud';

/** The time of day the animation starts at: 9:00, with the sun rising. */
const MORNING: DayCycle = Object.freeze({ phase: 9 / 24, darkness: 0 });

const NIGHT: DayCycle = Object.freeze({ phase: 0, darkness: 1 });

const toText = (hud: Hud, widget: string): string | undefined =>
  match(findHudWidget(hud, STREET_WINDOW, widget))
    .with({ kind: 'label' }, ({ text }) => text)
    .otherwise(() => undefined);

describe('patchDemoHud', () => {
  it('should write the frame rate on the time page', () => {
    expect(
      toText(patchDemoHud(createDemoHud(), 59.7, MORNING), FPS_WIDGET),
    ).toBe('FPS  60');
  });

  it('should write the time of day on the time page', () => {
    expect(
      toText(patchDemoHud(createDemoHud(), 60, MORNING), CLOCK_WIDGET),
    ).toBe('TIME 09:00');
  });

  it('should write how dark it is on the sky page', () => {
    expect(
      toText(patchDemoHud(createDemoHud(), 60, NIGHT), DARKNESS_WIDGET),
    ).toBe('DARK 100%');
  });

  it('should write how high the sun is on the sky page', () => {
    expect(toText(patchDemoHud(createDemoHud(), 60, MORNING), SUN_WIDGET)).toBe(
      'SUN +0.71',
    );
  });

  it('should write the sun below the horizon at night', () => {
    expect(toText(patchDemoHud(createDemoHud(), 60, NIGHT), SUN_WIDGET)).toBe(
      'SUN -1.00',
    );
  });

  it('should leave the windows where they are', () => {
    expect(
      findHudWindow(patchDemoHud(createDemoHud(), 60, MORNING), STREET_WINDOW),
    ).toMatchObject({
      row: findHudWindow(createDemoHud(), STREET_WINDOW)?.row ?? 0,
      column: findHudWindow(createDemoHud(), STREET_WINDOW)?.column ?? 0,
    });
  });

  it('should not change the HUD it is given', () => {
    const hud = createDemoHud();

    patchDemoHud(hud, 60, MORNING);

    expect(hud).toEqual(createDemoHud());
  });
});
