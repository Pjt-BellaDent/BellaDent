import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/appointments': 'http://localhost:3000',
      '/waiting': 'http://localhost:3000',
      '/api': 'http://localhost:3000',
      // '/waiting-status': 'http://localhost:3000', // ← 이 라인 있으면 반드시 삭제/주석처리!
      //
      // ★★★ Socket.IO 프록시 설정 추가 ★★★
      '/socket.io': {
        target: 'http://belladent.duckdns.org', // 실제 백엔드 Socket.IO 서버 주소
        ws: true, // WebSocket 프록시 활성화
        changeOrigin: true, // 요청 헤더의 Host 값을 target URL의 Host 값으로 변경
      },
    },
    historyApiFallback: true,
  },
});
