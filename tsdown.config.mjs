import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: { index: './libs/engine/src/index.ts' },
  outDir: './dist/lib',
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  tsconfig: './tsconfig.lib.json',
  dts: true,
  sourcemap: true,
  clean: true,
});
