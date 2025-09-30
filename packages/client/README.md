# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# BellaDent Client

## AI 채팅 기능 연동 상태

### ✅ 완료된 연동
- **백엔드 API**: `/ai/settings`, `/ai/ai` 엔드포인트 완전 구현
- **프론트엔드 API**: `aiChatApi.js`를 통한 통합 API 호출
- **실시간 통신**: Socket.IO를 통한 실시간 채팅
- **인증**: JWT 토큰 기반 인증 완료

### 🔧 API 사용법

#### 챗봇 설정 조회
```javascript
import { getChatbotSettings } from '../api/aiChatApi';

const settings = await getChatbotSettings();
```

#### 챗봇 설정 업데이트
```javascript
import { updateChatbotSettings } from '../api/aiChatApi';

await updateChatbotSettings(newSettings);
```

#### AI 메시지 전송
```javascript
import { sendMessageToAI } from '../api/aiChatApi';

const response = await sendMessageToAI(message, consultationId);
```

### 🧪 테스트
```javascript
import { testAIChatAPI } from '../utils/apiTest';

// 브라우저 콘솔에서 실행
await testAIChatAPI();
```

## 개발 서버 실행
```bash
npm run dev
```

## 빌드
```bash
npm run build
```
