import {
  CRT_UNIFORM_NAMES,
  GLOW_REACH,
  GLOW_STRENGTH,
  GLOW_THRESHOLD,
  GRAIN_AMOUNT,
  GRAIN_RATE,
  SCANLINE_DEPTH,
  SURFACE_AMOUNT,
  SURFACE_SCALE,
} from '../consts';
import { formatGlslFloat } from './format-glsl-float';

export const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform sampler2D ${CRT_UNIFORM_NAMES.frame};
uniform vec2 ${CRT_UNIFORM_NAMES.frameSize};
uniform vec2 ${CRT_UNIFORM_NAMES.canvasSize};
uniform float ${CRT_UNIFORM_NAMES.pixelSize};
uniform float ${CRT_UNIFORM_NAMES.time};

const float GLOW_STRENGTH = ${formatGlslFloat(GLOW_STRENGTH)};
const float GLOW_THRESHOLD = ${formatGlslFloat(GLOW_THRESHOLD)};
const int GLOW_REACH = ${GLOW_REACH};
const float SCANLINE_DEPTH = ${formatGlslFloat(SCANLINE_DEPTH)};
const float GRAIN_AMOUNT = ${formatGlslFloat(GRAIN_AMOUNT)};
const float GRAIN_RATE = ${formatGlslFloat(GRAIN_RATE)};
const float SURFACE_AMOUNT = ${formatGlslFloat(SURFACE_AMOUNT)};
const float SURFACE_SCALE = ${formatGlslFloat(SURFACE_SCALE)};
const vec3 LUMINANCE = vec3(0.299, 0.587, 0.114);

vec4 sampleFrame(vec2 position) {
  vec2 logical = floor(position / ${CRT_UNIFORM_NAMES.pixelSize});

  if (logical.x < 0.0 || logical.y < 0.0
      || logical.x >= ${CRT_UNIFORM_NAMES.frameSize}.x
      || logical.y >= ${CRT_UNIFORM_NAMES.frameSize}.y) {
    return vec4(0.0);
  }

  return texture2D(
    ${CRT_UNIFORM_NAMES.frame},
    (logical + 0.5) / ${CRT_UNIFORM_NAMES.frameSize}
  );
}

float hash(vec2 point) {
  vec3 mixed = fract(vec3(point.xyx) * 0.1031);
  mixed += dot(mixed, mixed.yzx + 33.33);
  return fract((mixed.x + mixed.y) * mixed.z);
}

float valueNoise(vec2 point) {
  vec2 cell = floor(point);
  vec2 blend = fract(point);
  blend = blend * blend * (3.0 - 2.0 * blend);

  return mix(
    mix(hash(cell), hash(cell + vec2(1.0, 0.0)), blend.x),
    mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), blend.x),
    blend.y
  );
}

vec3 computeBright(vec3 color) {
  return color * smoothstep(GLOW_THRESHOLD, 1.0, dot(color, LUMINANCE));
}

vec3 computeGlow(vec2 position, vec3 base) {
  vec3 glow = vec3(0.0);
  float total = 0.0;

  for (int row = -GLOW_REACH; row <= GLOW_REACH; row++) {
    for (int column = -GLOW_REACH; column <= GLOW_REACH; column++) {
      vec2 offset = vec2(float(column), float(row));
      float reach = length(offset);

      if (reach > float(GLOW_REACH)) {
        continue;
      }

      float weight = 1.0 - reach / (float(GLOW_REACH) + 1.0);

      glow += computeBright(sampleFrame(position + offset).rgb) * weight;
      total += weight;
    }
  }

  return max(glow / total - computeBright(base), 0.0);
}

float computeScanline(vec2 position) {
  float period = max(${CRT_UNIFORM_NAMES.pixelSize}, 2.0);
  float phase = (mod(floor(position.y), period) + 0.5) / period;

  return 1.0 - SCANLINE_DEPTH * smoothstep(0.4, 1.0, phase);
}

float computeGrain(vec2 position) {
  float grainFrame = floor(${CRT_UNIFORM_NAMES.time} * GRAIN_RATE / 1000.0);
  vec2 shift = fract(vec2(grainFrame * 0.6180339, grainFrame * 0.3819660))
    * 1024.0;

  return (hash(position + shift) - 0.5) * GRAIN_AMOUNT;
}

float computeSurface(vec2 position) {
  return (valueNoise(position / SURFACE_SCALE) - 0.5) * SURFACE_AMOUNT;
}

void main() {
  vec2 position = vec2(
    gl_FragCoord.x,
    ${CRT_UNIFORM_NAMES.canvasSize}.y - gl_FragCoord.y
  );
  vec4 base = sampleFrame(position);
  vec3 color = (base.rgb + computeGlow(position, base.rgb) * GLOW_STRENGTH)
    * computeScanline(position)
    * (1.0 + computeSurface(position))
    + computeGrain(position) * base.a;

  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, max(base.a, max(color.r, max(color.g, color.b))));
}
`;
