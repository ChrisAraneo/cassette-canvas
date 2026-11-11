import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const resolveFromRoot = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@cassette-canvas/common': resolveFromRoot('./libs/common/src/index.ts'),
      '@cassette-canvas/engine': resolveFromRoot('./libs/engine/src/index.ts'),
    },
  },
  test: {
    include: ['libs/**/*.spec.ts', 'apps/**/*.spec.ts'],
    environment: 'node',
  },
});
