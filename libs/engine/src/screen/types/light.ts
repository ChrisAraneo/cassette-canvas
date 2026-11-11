/**
 * A point light centered on the logical pixel at `row` and `column`. At its
 * center it brightens pixels by `intensity` extended shades (4 extended
 * shades = 1 sprite shade). The effect fades evenly to zero at `radius`
 * logical pixels. A negative intensity darkens. Sprites that cast shadows
 * block it.
 */
export interface Light {
  readonly id: string;
  readonly row: number;
  readonly column: number;
  readonly radius: number;
  readonly intensity: number;
}
