import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    proxy: {
      '/appointments': 'http://localhost:3000',
      '/waiting': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      // '/waiting-status': 'http://localhost:3000', // ← 이 라인 있으면 반드시 삭제/주석처리!
    },
    historyApiFallback: true,
  }
})
