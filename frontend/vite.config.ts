import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use relative asset URLs so the bundle works on any GitHub Pages project path.
  base: './',
  server: {
    port: 5173,
    open: false,
    proxy: { '/api': 'http://localhost:3000' },
  },
});
