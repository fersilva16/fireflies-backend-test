import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  splitting: false,
  clean: true,
  format: ['esm'],
  minify: true,
  sourcemap: true,
  target: 'es2022',
  bundle: true,
  platform: 'node',
  external: ['dotenv', 'mongoose', 'openai', 'js-tiktoken'],
});
