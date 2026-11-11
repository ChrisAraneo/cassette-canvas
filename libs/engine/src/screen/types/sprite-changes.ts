import type { SpritePlacement } from './sprite-placement';

/** The sprite fields to change. Fields you leave out keep their values. */
export type SpriteChanges = Partial<
  Pick<SpritePlacement, 'sprite' | 'row' | 'column' | 'castsShadow'>
>;
