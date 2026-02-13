import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/** Rewrite /favicon.ico to logo PNG so browsers get no 404. */
function faviconRewrite() {
  return {
    name: 'favicon-rewrite',
    configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/favicon.ico' || req.url === '/favicon.ico?') {
          req.url = '/agrosoluce.png';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), faviconRewrite()],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    copyPublicDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          // Chart libraries (large dependencies)
          'charts-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
          // Map libraries (large dependencies)
          'maps-vendor': ['leaflet', 'react-leaflet'],
          // Icons (can be large)
          'icons-vendor': ['lucide-react'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
    ],
  },
});

