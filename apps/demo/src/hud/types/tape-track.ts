/**
 * One track on the demo's tape: the id a `select` action names it by, the
 * title it shows on its first line, and how long it runs, which is the
 * second line of its item.
 */
export interface TapeTrack {
  readonly id: string;
  readonly title: string;
  readonly time: string;
}
