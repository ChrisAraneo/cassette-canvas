/** Counts frames to measure the frame rate. */
export interface FpsMeter {
  /** When the current count started, in milliseconds. */
  readonly since: number;
  /** How many frames were drawn since then. */
  readonly frames: number;
  /** The last frame rate measured, or 0 before the first measurement. */
  readonly fps: number;
}
