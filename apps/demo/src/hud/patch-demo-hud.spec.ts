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
  it('should return the frame rate on the time page when it patches the HUD', () => {
    expect(
      toText(patchDemoHud(createDemoHud(), 59.7, MORNING), FPS_WIDGET),
    ).toBe('FPS  60');
  });

  it('should return the time of day on the time page when it patches the HUD', () => {
    expect(
      toText(patchDemoHud(createDemoHud(), 60, MORNING), CLOCK_WIDGET),
    ).toBe('TIME 09:00');
  });

  it('should return the darkness on the sky page when it is night', () => {
    expect(
      toText(patchDemoHud(createDemoHud(), 60, NIGHT), DARKNESS_WIDGET),
    ).toBe('DARK 100%');
  });

  it('should return the height of the sun on the sky page when it is morning', () => {
    expect(toText(patchDemoHud(createDemoHud(), 60, MORNING), SUN_WIDGET)).toBe(
      'SUN +0.71',
    );
  });

  it('should return the height of the sun below the horizon when it is night', () => {
    expect(toText(patchDemoHud(createDemoHud(), 60, NIGHT), SUN_WIDGET)).toBe(
      'SUN -1.00',
    );
  });

  it('should return the windows where they are when it patches the HUD', () => {
    expect(
      findHudWindow(patchDemoHud(createDemoHud(), 60, MORNING), STREET_WINDOW),
    ).toMatchObject({
      row: findHudWindow(createDemoHud(), STREET_WINDOW)?.row ?? 0,
      column: findHudWindow(createDemoHud(), STREET_WINDOW)?.column ?? 0,
    });
  });

  it('should not change the HUD it is given when it patches it', () => {
    const hud = createDemoHud();

    patchDemoHud(hud, 60, MORNING);

    expect(hud).toEqual(createDemoHud());
  });
});
