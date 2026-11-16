import { describe, expect, it } from 'vitest';

import { HUD_CONTENT_LEFT } from '../consts';
import type { HudLabel } from '../types/hud-label';
import { toLeft } from './to-left';

const LABEL: HudLabel = Object.freeze({
  kind: 'LABEL',
  id: 'fps',
  page: '',
  row: 4,
  column: 6,
  text: 'FPS 60',
});

describe('toLeft', () => {
  it('should return the column measured from the left of the window when it places a widget', () => {
    expect(toLeft(LABEL)).toBe(HUD_CONTENT_LEFT + 6);
  });

  it('should return the first column of the content when the widget sits at the left of it', () => {
    expect(toLeft({ ...LABEL, column: 0 })).toBe(HUD_CONTENT_LEFT);
  });
});
