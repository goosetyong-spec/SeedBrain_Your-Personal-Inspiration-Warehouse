import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import * as VitePWA from 'vite-plugin-pwa';

const createPWA = VitePWA?.VitePWA ?? VitePWA?.default;

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {

    plugins: [
      react(),
      tailwindcss(),
      createPWA({
        registerType: 'autoUpdate',
        includeAssets: ['Frame 12.png'],
        manifest: {
          name: 'SeedBrain - Your Personal Inspiration Warehouse',
          short_name: 'SeedBrain',
          description: 'A personal inspiration warehouse app',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'Frame 12.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'Frame 12.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
