import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/appointments': 'http://localhost:3000',
      '/waiting': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
  },
});
