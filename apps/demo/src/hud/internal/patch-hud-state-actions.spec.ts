import type { HudAction } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { HOUR_BUTTON, HOUR_LENGTH, STREET_WINDOW } from '../consts';
import { createDemoHud } from '../create-demo-hud';
import type { HudState } from '../types/hud-state';
import { patchHudStateActions } from './patch-hud-state-actions';

const HOUR_CLICK: HudAction = Object.freeze({
  kind: 'CLICK',
  window: STREET_WINDOW,
  widget: HOUR_BUTTON,
  value: '',
});

const createState = (): HudState => ({ hud: createDemoHud(), clock: 0 });

describe('patchHudStateActions', () => {
  it('should return the clock moved by both actions when it handles them in order', () => {
    expect(
      patchHudStateActions(createState(), [HOUR_CLICK, HOUR_CLICK], 0).clock,
    ).toBe(2 * HOUR_LENGTH);
  });

  it('should return the very same state when the event caused no actions', () => {
    const state = createState();

    expect(patchHudStateActions(state, [], 0)).toBe(state);
  });
});
