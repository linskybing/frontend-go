import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
        namedExport: 'ReactComponent',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@nthucscc/ui': resolve(__dirname, 'packages/ui/src/index.ts'),
      '@nthucscc/utils': resolve(__dirname, 'packages/utils/src/index.ts'),
      '@nthucscc/components-shared': resolve(__dirname, 'packages/components-shared'),
    },
  },
  build: {
    outDir: resolve(__dirname, 'build'),
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
