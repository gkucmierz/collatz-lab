import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const spaLogsFallbackPlugin = () => ({
  name: 'spa-logs-route-fallback',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (
        req.url &&
        req.url.startsWith('/logs') &&
        !req.url.includes('?import') &&
        !req.url.includes('?raw') &&
        !req.url.includes('&raw')
      ) {
        req.url = '/index.html';
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [vue(), spaLogsFallbackPlugin()],
  server: {
    port: 45099,
    strictPort: true,
    allowedHosts: true
  },
  test: {
    include: ['tests/**/*.test.js']
  }
});
