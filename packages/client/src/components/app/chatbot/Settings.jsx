import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import axios from '../../../libs/axiosIntance';
import { v4 as uuidv4 } from 'uuid';
import axiosInstance from '../../../libs/axiosInstance';

// 상수 정의
const CHATBOT_SETTINGS_DOC = 'chatbotSettings';
const DEFAULT_FAQS = [
  { id: '접수', question: '진료 접수 방법', answer: '진료 접수는 방문 또는 전화로 가능합니다.', enabled: true },
  { id: '예약', question: '예약 변경 방법', answer: '예약 변경은 24시간 전에 연락 주시면 처리됩니다.', enabled: false },
  { id: '검사', question: '검사 결과 조회', answer: '검사 결과는 진료 후 마이페이지에서 확인 가능합니다.', enabled: true },
  { id: '진료비', question: '진료비 문의', answer: '진료비는 시술 항목에 따라 상이하니 전화문의 주세요.', enabled: false },
  { id: '시간', question: '진료 시간', answer: '평일 9시~18시 / 토요일 9시~13시 운영, 일요일/공휴일 휴무입니다.', enabled: true },
];

const QUESTION_LABELS = {
  접수: '진료 접수 방법',
  예약: '예약 변경 방법',
  검사: '검사 결과 조회',
  진료비: '진료비 문의',
  시간: '진료 시간'
};

// 모달 컴포넌트
const FaqModal = ({ isOpen, onClose, onSave, faq }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
    } else {
      setQuestion('');
      setAnswer('');
    }
  }, [faq]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ question, answer });
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border">
        <h2 className="text-xl font-bold mb-4">{faq ? '질문 수정' : '질문 추가'}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">질문(Question)</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">답변(Answer)</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            취소
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatbotSettings = () => {
  const [chatbotSettings, setChatbotSettings] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [selectedExample, setSelectedExample] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [aiMode, setAiMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [answerTimeRange, setAnswerTimeRange] = useState({ start: '09:00', end: '18:00' });
  const [rangeInput, setRangeInput] = useState({ start: '09:00', end: '18:00' });

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axiosInstance.get('/ai/settings');
      setChatbotSettings(res.data);
      setFaqs(res.data.faqs || []);
      setAiMode(res.data.aiMode !== undefined ? res.data.aiMode : true);
      setAnswerTimeRange(res.data.answerTimeRange || { start: '09:00', end: '18:00' });
    } catch (error) {
      setError("챗봇 설정을 불러오는 데 실패했습니다.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings) => {
    try {
      setIsSaving(true);
      setError(null);
      await axiosInstance.put('/ai/settings', newSettings);
      await fetchSettings(); // 최신 정보 다시 로드
    } catch (error) {
      setError("설정 저장에 실패했습니다.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenModal = (faq = null) => {
    setEditingFaq(faq);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
  };

  const handleSaveFaq = async (data) => {
    let updatedFaqs;
    if (editingFaq) {
      // 수정
      updatedFaqs = faqs.map(faq =>
        faq.id === editingFaq.id ? { ...faq, ...data } : faq
      );
    } else {
      // 추가
      const newFaq = { id: uuidv4(), ...data, isPublic: true };
      updatedFaqs = [...faqs, newFaq];
    }
    await updateSettings({ ...chatbotSettings, faqs: updatedFaqs });
    handleCloseModal();
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm("정말 이 질문을 삭제하시겠습니까?")) {
      const updatedFaqs = faqs.filter(faq => faq.id !== id);
      await updateSettings({ ...chatbotSettings, faqs: updatedFaqs });
    }
  };

  const handleTogglePublic = async (faqToToggle) => {
    const updatedFaqs = faqs.map(faq =>
      faq.id === faqToToggle.id ? { ...faq, isPublic: !faq.isPublic } : faq
    );
    await updateSettings({ ...chatbotSettings, faqs: updatedFaqs });
  };

  const handleToggleAiMode = async () => {
    const newAiMode = !aiMode;
    setAiMode(newAiMode);
    await updateSettings({ ...chatbotSettings, aiMode: newAiMode });
  };

  const activeFaqs = useMemo(() => faqs.filter(f => f.isPublic), [faqs]);
  const hoveredFaq = faqs.find(f => f.isHovered);

  // 로딩
  if (isLoading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">AI 챗봇 설정</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 질문 설정 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">자주 묻는 질문 설정</h2>
            <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              질문 추가
            </button>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 border rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">{faq.question}</p>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleOpenModal(faq)} className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100">
                    편집
                  </button>
                  <button onClick={() => handleDeleteFaq(faq.id)} className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50">
                    삭제
                  </button>
                  <button
                    onClick={() => handleTogglePublic(faq)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${faq.isPublic ? 'bg-blue-600' : 'bg-gray-200'}`}
                    disabled={isSaving}
                  >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${faq.isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 응답 예시 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">고객에게 보이는 응답 예시</h2>
              <div className="flex items-center space-x-2">
                 <span className="text-sm">AI 채팅 모드</span>
                 <button 
                    onClick={handleToggleAiMode}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${aiMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                    disabled={isSaving}
                  >
                   <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${aiMode ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
              </div>
           </div>
           <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-gray-800">질문: {faqs[0]?.question || '등록된 질문이 없습니다.'}</p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">AI 답변:</span> {faqs[0]?.answer || ''}
              </p>
           </div>
           <div className="bg-blue-50 p-4 rounded-lg">
             <h3 className="font-bold mb-3">활성화된 답변</h3>
             <ul className="space-y-2">
                {activeFaqs.map(faq => (
                  <li key={faq.id} className="flex items-center text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {faq.question}
                  </li>
                ))}
             </ul>
           </div>
           <button className="mt-6 w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
             AI 자동 답변 가능 시간대 설정
           </button>
        </div>
      </div>
      <FaqModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveFaq} faq={editingFaq} />
    </div>
  );
};

export default ChatbotSettings;
