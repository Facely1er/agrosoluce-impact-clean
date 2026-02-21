import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['agrosoluce.png', 'favicon.ico'],
      manifest: {
        name: 'AgroSoluce Intelligence - Field Operations',
        short_name: 'AgroSoluce Intel',
        description: 'Field Intelligence & Operations Platform - For ERMITS team, cooperative managers, and farmers. Offline-first field operations tool.',
        theme_color: '#2E7D32',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/agrosoluce.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/agrosoluce.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        categories: ['business', 'productivity', 'agriculture'],
        shortcuts: [
          {
            name: 'ERMITS Command Center',
            short_name: 'ERMITS',
            description: 'Monitor cooperatives and compliance',
            url: '/ermits',
            icons: [{ src: '/agrosoluce.png', sizes: '192x192' }],
          },
          {
            name: 'Cooperative Dashboard',
            short_name: 'Cooperative',
            description: 'Operations and members',
            url: '/cooperative',
            icons: [{ src: '/agrosoluce.png', sizes: '192x192' }],
          },
          {
            name: 'Farmer Field App',
            short_name: 'Farmer',
            description: 'Field data and training',
            url: '/farmer',
            icons: [{ src: '/agrosoluce.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
  },
});

