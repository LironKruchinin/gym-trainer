// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  envDir: 'config/env',
  envPrefix: 'VITE_',
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      // point `@styles/*` → `<project-root>/frontend/src/assets/styles/*`
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
      // if you need other aliases, add them here too:
      // '@components': path.resolve(__dirname, 'src/components'),
      '@store': path.resolve(__dirname, 'src/store'),
    },
  },
  server: {
    port: 3000,
  },
});
