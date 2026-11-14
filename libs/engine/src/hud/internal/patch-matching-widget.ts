import { match } from 'ts-pattern';
import type { HudWidget } from '../types/hud-widget';
import type { HudWidgetChanges } from '../types/hud-widget-changes';

const patchWidget = (widget: HudWidget, changes: HudWidgetChanges): HudWidget =>
  match(widget)
    .with({ kind: 'label' }, (label) => ({
      ...label,
      text: changes.text ?? label.text,
    }))
    .with({ kind: 'button' }, (button) => ({
      ...button,
      text: changes.text ?? button.text,
      width: changes.width ?? button.width,
    }))
    .with({ kind: 'input' }, (input) => ({
      ...input,
      text: changes.text ?? input.text,
      width: changes.width ?? input.width,
    }))
    .with({ kind: 'tabs' }, (strip) => ({
      ...strip,
      tabs: changes.tabs ?? strip.tabs,
    }))
    .with({ kind: 'panel' }, (panel) => ({
      ...panel,
      width: changes.width ?? panel.width,
      height: changes.height ?? panel.height,
    }))
    .with({ kind: 'divider' }, (divider) => ({
      ...divider,
      width: changes.width ?? divider.width,
    }))
    .with({ kind: 'list' }, (list) => ({
      ...list,
      width: changes.width ?? list.width,
      height: changes.height ?? list.height,
      items: changes.items ?? list.items,
      scroll: changes.scroll ?? list.scroll,
      selected: changes.selected ?? list.selected,
    }))
    .exhaustive();

export const patchMatchingWidget = (
  widget: HudWidget,
  id: string,
  changes: HudWidgetChanges,
): HudWidget =>
  match(widget.id === id)
    .with(true, () => patchWidget(widget, changes))
    .otherwise(() => widget);
