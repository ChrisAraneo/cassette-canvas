import { describe, expect, it } from 'vitest';

import { HUD_CONTENT_TOP } from '../consts';
import type { HudLabel } from '../types/hud-label';
import { toTop } from './to-top';

const LABEL: HudLabel = Object.freeze({
  kind: 'LABEL',
  id: 'fps',
  page: '',
  row: 4,
  column: 6,
  text: 'FPS 60',
});

describe('toTop', () => {
  it('should return the row measured from the top of the window when it places a widget', () => {
    expect(toTop(LABEL)).toBe(HUD_CONTENT_TOP + 4);
  });

  it('should return the first row of the content when the widget sits at the top of it', () => {
    expect(toTop({ ...LABEL, row: 0 })).toBe(HUD_CONTENT_TOP);
  });
});
