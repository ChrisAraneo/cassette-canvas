import { match } from 'ts-pattern';

/**
 * Calls `effect` with `value`, then returns `value`. Use it to run a side
 * effect as a step in a `pipe`: `(scene) => runEffect(scene, draw)`.
 */
export const runEffect = <T>(value: T, effect: (value: T) => void): T =>
  match(effect(value)).otherwise(() => value);
