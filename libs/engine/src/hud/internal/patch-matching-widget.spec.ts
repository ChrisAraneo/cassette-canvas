import { describe, expect, it } from 'vitest';

import type { HudButton } from '../types/hud-button';
import type { HudInput } from '../types/hud-input';
import type { HudLabel } from '../types/hud-label';
import type { HudTabs } from '../types/hud-tabs';
import { patchMatchingWidget } from './patch-matching-widget';

const LABEL: HudLabel = Object.freeze({
  kind: 'label',
  id: 'fps',
  page: '',
  row: 0,
  column: 0,
  text: 'FPS 60',
});

const BUTTON: HudButton = Object.freeze({
  kind: 'button',
  id: 'skip',
  page: '',
  row: 0,
  column: 0,
  width: 30,
  text: 'SKIP',
});

const INPUT: HudInput = Object.freeze({
  kind: 'input',
  id: 'note',
  page: '',
  row: 0,
  column: 0,
  width: 60,
  text: 'hello',
});

const TABS: HudTabs = Object.freeze({
  kind: 'tabs',
  id: 'tabs',
  page: '',
  row: 0,
  column: 0,
  tabs: [{ id: 'scene', text: 'SCENE' }],
});

describe('patchMatchingWidget', () => {
  it('should change the text of a label', () => {
    expect(patchMatchingWidget(LABEL, 'fps', { text: 'FPS 30' })).toEqual({
      ...LABEL,
      text: 'FPS 30',
    });
  });

  it('should change the text and the width of a button', () => {
    expect(
      patchMatchingWidget(BUTTON, 'skip', { text: 'HOLD', width: 40 }),
    ).toEqual({ ...BUTTON, text: 'HOLD', width: 40 });
  });

  it('should change the text of a field', () => {
    expect(patchMatchingWidget(INPUT, 'note', { text: 'bye' })).toEqual({
      ...INPUT,
      text: 'bye',
    });
  });

  it('should change the tabs of a strip', () => {
    expect(
      patchMatchingWidget(TABS, 'tabs', {
        tabs: [{ id: 'light', text: 'LIGHT' }],
      }),
    ).toEqual({ ...TABS, tabs: [{ id: 'light', text: 'LIGHT' }] });
  });

  it('should leave a field the widget does not have alone', () => {
    expect(patchMatchingWidget(LABEL, 'fps', { width: 40 })).toEqual(LABEL);
  });

  it('should give the very same widget when the id does not match', () => {
    expect(patchMatchingWidget(LABEL, 'clock', { text: 'FPS 30' })).toBe(LABEL);
  });
});
