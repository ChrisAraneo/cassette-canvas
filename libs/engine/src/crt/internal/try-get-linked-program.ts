import { constant } from 'lodash-es';
import { match } from 'ts-pattern';

export const tryGetLinkedProgram = (
  context: WebGLRenderingContext,
  program: WebGLProgram,
): WebGLProgram | undefined =>
  match(context.getProgramParameter(program, context.LINK_STATUS))
    .with(true, () => program)
    .otherwise(constant(undefined));
