import axios from "axios";
import dotenv from "dotenv";
import { db, admin } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const defaultFaqs = [
  { title: "병원 진료시간은 어떻게 되나요?", content: "병원 진료시간은 평일 10시부터 19시까지, 토요일은 10시부터 15시까지입니다." },
  { title: "주차는 가능한가요?", content: "병원 건물 내 지하 주차장을 이용하실 수 있습니다." },
  { title: "예약은 어떻게 하나요?", content: "전화, 홈페이지, 카카오채널을 통해 예약이 가능합니다." },
  { title: "비급여 진료 항목은 어떤 것이 있나요?", content: "대표적인 비급여 항목으로는 미백, 라미네이트, 임플란트 등이 있습니다." },
  { title: "교정 상담은 어느 시간대에 가능한가요?", content: "평일 진료시간 내 언제든지 가능합니다. 예약을 권장드립니다." },
  { title: "치아 미백 시술 시간은 얼마나 걸리나요?", content: "대략 30분에서 1시간 정도 소요됩니다." },
  { title: "응급 진료는 가능한가요?", content: "응급 상황은 사전에 연락 주시면 최대한 빠르게 진료 도와드립니다." },
  { title: "의료보험은 적용되나요?", content: "보험 적용 여부는 진료 항목에 따라 다르며, 자세한 내용은 접수 시 안내드립니다." },
  { title: "임플란트 보증 기간은 얼마나 되나요?", content: "임플란트 보증은 시술일로부터 5년입니다." },
  { title: "진료비 결제 방법은 무엇이 있나요?", content: "현금, 카드, 계좌이체 모두 가능합니다." },
  { title: "온라인 상담은 어떻게 이루어지나요?", content: "홈페이지 또는 카카오채널을 통해 상담 요청이 가능합니다." },
  { title: "교정 치료는 몇 세부터 가능한가요?", content: "보통 12세 이후부터 교정 치료가 가능합니다." },
  { title: "진료 시 보호자 동반이 필요한가요?", content: "미성년자는 반드시 보호자 동반이 필요합니다." },
  { title: "치료 후 주의사항은 어디서 확인하나요?", content: "홈페이지 공지사항 또는 카카오채널을 통해 확인 가능합니다." },
  { title: "병원에 처음 방문하면 무엇을 준비해야 하나요?", content: "신분증과 의료보험증을 지참해 주시기 바랍니다." },
].map(item => ({
  id: uuidv4(),
  question: item.title,
  answer: item.content,
  isPublic: true,
  authorId: "SYSTEM",
}));

export const GeminiChat = async (req, res) => {
  try {
    const { message, consultationId } = req.body;
    const { io } = req; // 소켓 인스턴스 가져오기

    if (!message || !consultationId) {
      return res.status(400).json({ error: "'message' 또는 'consultationId'가 누락되었습니다." });
    }

    // 1. 챗봇 설정 및 운영 시간 확인
    const settingsDoc = await db.collection('hospital').doc('chatbot_settings').get();
    const settings = settingsDoc.exists ? settingsDoc.data() : {};
    const { answerTimeRange } = settings;

    let isOffHours = false;
    if (answerTimeRange && answerTimeRange.start && answerTimeRange.end) {
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = currentHours * 60 + currentMinutes;

      const [startHours, startMinutes] = answerTimeRange.start.split(':').map(Number);
      const startTime = startHours * 60 + startMinutes;

      const [endHours, endMinutes] = answerTimeRange.end.split(':').map(Number);
      const endTime = endHours * 60 + endMinutes;

      if (currentTime < startTime || currentTime > endTime) {
        isOffHours = true;
      }
    }

    // 사용자 메시지 저장
    const userMessageData = {
      senderId: consultationId,
      senderType: "patient",
      content: message,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await db.collection("consultations").doc(consultationId).collection("messages").add(userMessageData);
    
    // 운영 시간이 아닐 경우 안내 메시지 전송 후 종료
    if (isOffHours) {
      const offHoursMessage = `현재는 AI 챗봇 운영 시간이 아닙니다. 운영 시간은 ${answerTimeRange.start}부터 ${answerTimeRange.end}까지입니다.`;
      const aiMessageRef = await db.collection("consultations").doc(consultationId).collection("messages").add({
          senderId: "AI_Bot_System",
          senderType: "ai",
          content: offHoursMessage,
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      const aiMessage = (await aiMessageRef.get()).data();
      io.to(consultationId).emit('newMessage', { id: aiMessageRef.id, ...aiMessage });
      return res.status(200).json({ answer: offHoursMessage, isOffHours: true });
    }

    // 2. FAQ에서 답변 검색
    let faqReply = null;
    const faqs = settings.faqs || [];
    const matchedFaq = faqs.find(faq => {
      if (!faq.isPublic) return false;
      if (faq.question.includes(message)) return true;
      if (faq.keywords && faq.keywords.length > 0) {
        return faq.keywords.some(keyword => message.includes(keyword));
      }
      return false;
    });
    if (matchedFaq) {
      faqReply = matchedFaq.answer;
    }

    const aiReplyContent = faqReply || "죄송합니다, 지금은 답변하기 어렵습니다. 관리자가 곧 확인 후 답변드릴 예정입니다.";

    const aiMessageRef = await db.collection("consultations").doc(consultationId).collection("messages").add({
      senderId: "AI_Bot_FAQ",
      senderType: "ai",
      content: aiReplyContent,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    const aiMessage = (await aiMessageRef.get()).data();
    
    // 실시간으로 클라이언트에 새 AI 메시지 전송
    io.to(consultationId).emit('newMessage', {
      id: aiMessageRef.id,
      ...aiMessage
    });
        
    return res.status(200).json({ answer: aiReplyContent });

  } catch (error) {
    console.error("GeminiChat Error:", error.message);
    if (error.response) {
      console.error("Error Response Body:", error.response.data);
    }
    res.status(500).json({ error: "AI 응답 처리 중 서버 오류가 발생했습니다." });
  }
};

const settingsDocRef = db.collection('hospital').doc('chatbot_settings');

/**
 * 챗봇 설정 정보 조회
 */
export const getChatbotSettings = async (req, res) => {
  try {
    let doc = await settingsDocRef.get();
    if (!doc.exists) {
      // 문서가 없으면 기존 faqs 컬렉션에서 마이그레이션 시도
      const faqsSnapshot = await db.collection('faqs').get();
      const oldFaqs = faqsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 클라이언트 형식에 맞게 데이터 변환 (question, answer)
      const migratedFaqs = oldFaqs.map(faq => ({
        id: faq.id || uuidv4(),
        question: faq.title,
        answer: faq.content,
        isPublic: faq.isPublic !== undefined ? faq.isPublic : true,
        authorId: faq.authorId || 'SYSTEM_MIGRATED'
      }));

      const defaultSettings = {
        persona: '친절한 치과 상담원',
        guidelines: [
          '병원 정보, 예약 절차, 진료 서비스에 대해 안내합니다.',
          '의료적 진단이나 처방은 제공하지 않습니다.',
          '민감한 개인정보는 수집하지 않습니다.'
        ],
        faqs: migratedFaqs, // 마이그레이션된 데이터 사용
        aiMode: true
      };
      
      // 새 위치에 데이터 저장
      await settingsDocRef.set(defaultSettings);
      
      // 새로 저장된 데이터를 다시 읽어서 반환
      doc = await settingsDocRef.get();
    }
    res.status(200).json(doc.data());
  } catch (error) {
    console.error("챗봇 설정 조회 실패:", error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 챗봇 설정 정보 업데이트
 */
export const updateChatbotSettings = async (req, res) => {
  try {
    const settings = req.body;
    // TODO: Joi를 사용한 입력값 검증 추가
    await settingsDocRef.set(settings, { merge: true });
    res.status(200).json({ message: '챗봇 설정이 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error("챗봇 설정 업데이트 실패:", error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
