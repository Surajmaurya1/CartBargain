import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/CartBargain-frontend/',
  server: {
    port: 5173,
    open: false,
    proxy: { '/api': 'http://localhost:3000' },
  },
});
