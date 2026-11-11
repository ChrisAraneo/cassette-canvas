import type { Crt } from '../../../crt/types/crt';
import type { Display } from '../../types/display';

export interface DisplayDraft extends Omit<Display, 'context' | 'crt'> {
  readonly context: WebGLRenderingContext | undefined;
  readonly crt: Crt | undefined;
}
