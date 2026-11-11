import type { CrtUniforms } from '../../types/crt-uniforms';

export interface CrtDraft {
  readonly program: WebGLProgram | undefined;
  readonly texture: WebGLTexture | undefined;
  readonly vertices: WebGLBuffer | undefined;
  readonly uniforms: CrtUniforms | undefined;
}
