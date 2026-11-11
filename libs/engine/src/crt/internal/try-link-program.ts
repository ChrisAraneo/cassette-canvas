import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import { POSITION_ATTRIBUTE, POSITION_LOCATION } from '../consts';

export const tryLinkProgram = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | undefined =>
  pipe(
    program,
    (created) =>
      runEffect(created, (target) =>
        context.attachShader(target, vertexShader),
      ),
    (attached) =>
      runEffect(attached, (target) =>
        context.attachShader(target, fragmentShader),
      ),
    (attached) =>
      runEffect(attached, (target) =>
        context.bindAttribLocation(
          target,
          POSITION_LOCATION,
          POSITION_ATTRIBUTE,
        ),
      ),
    (bound) => runEffect(bound, (target) => context.linkProgram(target)),
    (linked) =>
      match(context.getProgramParameter(linked, context.LINK_STATUS))
        .with(true, () => linked)
        .otherwise(() => undefined),
  );
