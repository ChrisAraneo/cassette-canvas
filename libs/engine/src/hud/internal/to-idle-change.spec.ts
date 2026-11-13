import { describe, expect, it } from 'vitest';

import { createHud } from '../create-hud';
import { toIdleChange } from './to-idle-change';

describe('toIdleChange', () => {
  it('should let go of what the pointer held', () => {
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

  it('should give up the keys', () => {
    expect(
      toIdleChange({
        ...createHud(),
        focus: { window: 'notes', widget: 'note' },
      }).hud.focus,
    ).toBeUndefined();
  });

  it('should report nothing happening', () => {
    expect(toIdleChange(createHud()).actions).toEqual([]);
  });
});
