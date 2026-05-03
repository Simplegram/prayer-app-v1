import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  base: '/prayer-app/',
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp}'],
      },
      manifest: {
        name: 'Prayer Book',
        short_name: 'Prayers',
        description: 'A simple offline prayer reader',
        start_url: '/',
        display: 'standalone',
        background_color: '#FFFDF5',
        theme_color: '#3B82F6',
        orientation: 'any',
        icons: [
          {
            src: 'prayer.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
    }),

  ],
  build: {
    target: 'es2015',
  },
});
