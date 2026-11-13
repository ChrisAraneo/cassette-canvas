import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { paintCloseBox } from './paint-close-box';

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: '',
  widgets: [],
});

const createHoldingHud = (): Hud => ({
  ...createHud(),
  grab: { kind: 'close', window: 'street', widget: '', row: 0, column: 0 },
});

const toBevel = (hud: Hud): OverlayPaint | undefined =>
  paintCloseBox(hud, WINDOW)[1];

describe('paintCloseBox', () => {
  it('should paint nothing when the window cannot be closed', () => {
    expect(paintCloseBox(createHud(), { ...WINDOW, closable: false })).toEqual(
      [],
    );
  });

  it('should fill the box with the light face of the theme', () => {
    expect(paintCloseBox(createHud(), WINDOW)[0]).toMatchObject({
      pixel: toPixel(15, createHud().theme.face),
    });
  });

  it('should light the top of the box while it is not held', () => {
    expect(toBevel(createHud())).toMatchObject({
      pixel: toPixel(15, createHud().theme.highlight),
    });
  });

  it('should turn the bevel around while it is held', () => {
    expect(toBevel(createHoldingHud())).toMatchObject({
      pixel: toPixel(15, createHud().theme.shadow),
    });
  });

  it('should move the cross down and right while it is held', () => {
    const resting = paintCloseBox(createHud(), WINDOW);
    const held = paintCloseBox(createHoldingHud(), WINDOW);

    expect(held[size(held) - 1]).toMatchObject({
      row: (resting[size(resting) - 1]?.row ?? 0) + 1,
    });
  });
});
