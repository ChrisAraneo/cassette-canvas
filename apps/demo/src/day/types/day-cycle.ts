/** Where the day is at one moment of the animation. */
export interface DayCycle {
  /** The time of day: 0 is midnight, 0.25 is 6:00, 0.5 is noon. */
  readonly phase: number;
  /** 0 in full daylight, 1 at night, and in between at dawn and dusk. */
  readonly darkness: number;
}
