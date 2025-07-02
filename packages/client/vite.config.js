import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/appointments': 'http://belladent.duckdns.org',
      '/waiting': 'http://belladent.duckdns.org',
      '/api': 'http://belladent.duckdns.org',
      '/socket.io': {
        target: 'http://belladent.duckdns.org',
        ws: true,
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
});
