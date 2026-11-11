import type { LightSettings } from './light-settings';

/** The light fields to change. Fields you leave out keep their values. */
export type LightChanges = Partial<LightSettings>;
