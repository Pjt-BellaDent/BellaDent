import { getChatbotSettings, updateChatbotSettings, sendMessageToAI } from '../api/aiChatApi';

/**
 * AI 채팅 API 연동 테스트 함수
 */
export const testAIChatAPI = async () => {
  console.log('🧪 AI 채팅 API 연동 테스트 시작...');
  
  try {
    // 1. 챗봇 설정 조회 테스트
    console.log('1️⃣ 챗봇 설정 조회 테스트...');
    const settings = await getChatbotSettings();
    console.log('✅ 챗봇 설정 조회 성공:', settings);
    
    // 2. AI 메시지 전송 테스트
    console.log('2️⃣ AI 메시지 전송 테스트...');
    const testMessage = '안녕하세요, 진료 시간이 궁금합니다.';
    const aiResponse = await sendMessageToAI(testMessage, 'test-consultation-id');
    console.log('✅ AI 응답 성공:', aiResponse);
    
    console.log('🎉 모든 API 테스트 통과!');
    return true;
  } catch (error) {
    console.error('❌ API 테스트 실패:', error);
    return false;
  }
};

/**
 * API 엔드포인트 상태 확인
 */
export const checkAPIEndpoints = async () => {
  const endpoints = [
    { name: '챗봇 설정 조회', method: 'GET', path: '/ai/settings' },
    { name: 'AI 응답 생성', method: 'POST', path: '/ai/ai' }
  ];
  
  console.log('🔍 API 엔드포인트 상태 확인...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(endpoint.method === 'POST' && {
          body: JSON.stringify({ message: 'test' })
        })
      });
      
      console.log(`✅ ${endpoint.name}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint.name}: 연결 실패`);
    }
  }
}; 