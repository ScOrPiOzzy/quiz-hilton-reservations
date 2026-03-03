import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/auth/index.ts',
    'src/user/index.ts',
    'src/reservation/index.ts',
  ],
  format: ['esm'],
  dts: true,
  splitting: false,
  clean: true,
});
