import { POSITION_ATTRIBUTE } from '../consts';

export const VERTEX_SHADER_SOURCE = `
attribute vec2 ${POSITION_ATTRIBUTE};

void main() {
  gl_Position = vec4(${POSITION_ATTRIBUTE}, 0.0, 1.0);
}
`;
