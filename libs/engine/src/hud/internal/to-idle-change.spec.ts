import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import { toIdleChange } from './to-idle-change';

describe('toIdleChange', () => {
  it('should return no grab when it makes an idle change', () => {
    expect(
      toIdleChange({
        ...createHud(),
        grab: {
          kind: 'drag',
          window: 'street',
          widget: '',
          row: 0,
          column: 0,
        },
      }).hud.grab,
    ).toBeUndefined();
  });

  it('should return no focus when it makes an idle change', () => {
    expect(
      toIdleChange({
        ...createHud(),
        focus: { window: 'notes', widget: 'note' },
      }).hud.focus,
    ).toBeUndefined();
  });

  it('should return no actions when it makes an idle change', () => {
    expect(toIdleChange(createHud()).actions).toEqual([]);
  });
});
