import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const resolveFromRoot = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  root: resolveFromRoot('./apps/demo'),
  resolve: {
    alias: {
      '@cassette-canvas/common': resolveFromRoot('./libs/common/src/index.ts'),
      '@cassette-canvas/engine': resolveFromRoot('./libs/engine/src/index.ts'),
    },
  },
  build: {
    outDir: resolveFromRoot('./dist/demo'),
    emptyOutDir: true,
  },
});
