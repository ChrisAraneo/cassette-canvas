import type { CrtUniforms } from './crt-uniforms';

/**
 * The WebGL objects the monitor effect needs: the shader program, the frame
 * texture, the vertex buffer, and the uniform locations.
 */
export interface Crt {
  readonly program: WebGLProgram;
  readonly texture: WebGLTexture;
  readonly vertices: WebGLBuffer;
  readonly uniforms: CrtUniforms;
}
