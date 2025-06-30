import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  getChatbotSettings,
  updateChatbotSettings,
  getFaqs,
  saveFaqs,
} from '../../../api/aiChatApi';
import { useHospitalInfo } from '../../../contexts/HospitalContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 모달 컴포넌트 (FAQ 추가/수정용)
const FaqModal = ({ isOpen, onClose, onSave, faq, isSaving }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setKeywords(faq.keywords ? faq.keywords.join(',') : '');
    } else {
      setQuestion('');
      setAnswer('');
      setKeywords('');
    }
  }, [faq]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      question,
      answer,
      keywords: keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg border">
        <h2 className="text-xl font-bold mb-4">
          {faq ? '질문 수정' : '질문 추가'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              질문(Question)
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              답변(Answer)
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="4"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              핵심 키워드 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="예: 비급여, 비용, 가격"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

// 시간 설정 모달 컴포넌트
const TimeSettingModal = ({
  isOpen,
  onClose,
  onSave,
  initialTimeRange,
  isSaving,
}) => {
  const [newTimeRange, setNewTimeRange] = useState(initialTimeRange);

  useEffect(() => {
    setNewTimeRange(initialTimeRange);
  }, [initialTimeRange]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(newTimeRange);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm transform transition-all border">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          AI 자동 답변 시간
        </h2>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="startTimeModal"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              시작 시간
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <input
                type="time"
                id="startTimeModal"
                value={newTimeRange.start}
                onChange={(e) =>
                  setNewTimeRange((prev) => ({
                    ...prev,
                    start: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="endTimeModal"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              종료 시간
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <input
                type="time"
                id="endTimeModal"
                value={newTimeRange.end}
                onChange={(e) =>
                  setNewTimeRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-8">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {isSaving ? '저장중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatbotSettings = () => {
  const [chatbotSettings, setChatbotSettings] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [selectedExample, setSelectedExample] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [aiMode, setAiMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [answerTimeRange, setAnswerTimeRange] = useState({
    start: '09:00',
    end: '18:00',
  });
  const [rangeInput, setRangeInput] = useState({
    start: '09:00',
    end: '18:00',
  });
  const { hospitalInfo, loading: hospitalLoading } = useHospitalInfo();

  // 시간 설정 관련 상태
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState({ start: '09:00', end: '18:00' });

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getChatbotSettings();
      setChatbotSettings(res);
      setFaqs(res.faqs || []);
      setAiMode(res.aiMode !== undefined ? res.aiMode : true);
      setAnswerTimeRange(
        res.answerTimeRange || { start: '09:00', end: '18:00' }
      );
      // 서버에서 받은 시간 설정으로 초기화
      if (res.answerTimeRange) {
        setTimeRange(res.answerTimeRange);
      }
    } catch (error) {
      setError('챗봇 설정을 불러오는 데 실패했습니다.');
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
      await updateChatbotSettings(newSettings);
      await fetchSettings(); // 최신 정보 다시 로드
      toast.success('설정이 저장되었습니다.');
    } catch (error) {
      setError('설정 저장에 실패했습니다.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenFaqModal = (faq = null) => {
    setEditingFaq(faq);
    setIsFaqModalOpen(true);
  };

  const handleCloseFaqModal = () => {
    setIsFaqModalOpen(false);
    setEditingFaq(null);
  };

  const handleSaveFaq = async (data) => {
    let updatedFaqs;
    if (editingFaq) {
      // 수정
      updatedFaqs = faqs.map((faq) =>
        faq.id === editingFaq.id ? { ...faq, ...data } : faq
      );
    } else {
      // 추가
      const newFaq = { id: uuidv4(), ...data, isPublic: true };
      updatedFaqs = [...faqs, newFaq];
    }
    await updateSettings({ ...chatbotSettings, faqs: updatedFaqs });
    handleCloseFaqModal();
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('정말 이 질문을 삭제하시겠습니까?')) {
      const updatedFaqs = faqs.filter((faq) => faq.id !== id);
      await updateSettings({ ...chatbotSettings, faqs: updatedFaqs });
    }
  };

  const handleTogglePublic = async (faqToToggle) => {
    const updatedFaqs = faqs.map((faq) =>
      faq.id === faqToToggle.id ? { ...faq, isPublic: !faq.isPublic } : faq
    );
    await updateSettings({ ...chatbotSettings, faqs: updatedFaqs });
  };

  const handleToggleAiMode = async () => {
    const newAiMode = !aiMode;
    setAiMode(newAiMode);
    await updateSettings({ ...chatbotSettings, aiMode: newAiMode });
  };

  const activeFaqs = useMemo(() => faqs.filter((f) => f.isPublic), [faqs]);
  const hoveredFaq = faqs.find((f) => f.isHovered);

  const handleSaveFaqs = async () => {
    try {
      await saveFaqs(faqs);
      toast.success('FAQ가 성공적으로 저장되었습니다.');
    } catch (error) {
      toast.error('FAQ 저장에 실패했습니다.');
      console.error('Error saving FAQs:', error);
    }
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { title: '', content: '', keywords: '' }]);
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleRemoveFaq = (index) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs);
  };

  // 시간 설정 저장
  const handleSaveTimeRange = async (newTimeRange) => {
    await updateSettings({ answerTimeRange: newTimeRange });
    setIsTimeModalOpen(false); // 저장 후 모달 닫기
  };

  // 로딩
  if (isLoading || hospitalLoading)
    return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI 챗봇 설정</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 질문 설정 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">자주 묻는 질문 설정</h2>
            <button
              onClick={() => handleOpenFaqModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              질문 추가
            </button>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="p-4 border rounded-md">
                <div>
                  <p className="font-semibold">{faq.question}</p>
                  <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                  {faq.keywords && faq.keywords.length > 0 && (
                    <div className="mt-2 flex items-center flex-wrap gap-1">
                      <span className="text-xs font-semibold mr-1">
                        키워드:
                      </span>
                      {faq.keywords.map((kw, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-3 justify-end">
                  <button
                    onClick={() => handleOpenFaqModal(faq)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
                  >
                    편집
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="px-3 py-1 border border-red-500 text-red-500 rounded-md text-sm hover:bg-red-50"
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => handleTogglePublic(faq)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                      faq.isPublic ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    disabled={isSaving}
                  >
                    <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                        faq.isPublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
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
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  aiMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                disabled={isSaving}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    aiMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm font-semibold text-gray-800">
              질문: {faqs[0]?.question || '등록된 질문이 없습니다.'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-semibold">AI 답변:</span>{' '}
              {faqs[0]?.answer || ''}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-3">활성화된 답변</h3>
            <ul className="space-y-2">
              {activeFaqs.map((faq) => (
                <li key={faq.id} className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {faq.question}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 border-t pt-6">
            <h3 className="font-bold mb-3 text-lg">AI 자동 답변 시간</h3>
            <div>
              <p className="text-gray-600">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {timeRange.start}
                </span>{' '}
                부터
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {timeRange.end}
                </span>{' '}
                까지
              </p>
              <button
                onClick={() => setIsTimeModalOpen(true)}
                className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              >
                시간대 변경
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleAddFaq}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          FAQ 추가
        </button>
        <button
          onClick={handleSaveFaqs}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          모든 변경사항 저장
        </button>
      </div>
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={handleCloseFaqModal}
        onSave={handleSaveFaq}
        faq={editingFaq}
        isSaving={isSaving}
      />
      <TimeSettingModal
        isOpen={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        onSave={handleSaveTimeRange}
        initialTimeRange={timeRange}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ChatbotSettings;
