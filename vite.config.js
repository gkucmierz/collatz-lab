import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 45099,
    strictPort: true,
    allowedHosts: true
  },
  test: {
    include: ['tests/**/*.test.js']
  }
});
