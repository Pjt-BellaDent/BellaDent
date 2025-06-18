import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

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

const ChatbotSettings = () => {
  // FAQ 배열 상태
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  // 편집/추가 폼 상태
  const [editIndex, setEditIndex] = useState(null); // null: 편집X, 숫자: 편집, 'new': 추가
  const [form, setForm] = useState({ question: '', answer: '', enabled: true });
  // 예시 선택 상태
  const [selectedExample, setSelectedExample] = useState(0);
  // 기타 상태
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  // AI 모드, 시간대
  const [aiMode, setAiMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [answerTimeRange, setAnswerTimeRange] = useState({ start: '09:00', end: '18:00' });
  const [rangeInput, setRangeInput] = useState({ start: '09:00', end: '18:00' });

  // Firestore에서 FAQ/설정 불러오기
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const settingsDoc = doc(db, 'settings', CHATBOT_SETTINGS_DOC);
      const settingsSnapshot = await getDoc(settingsDoc);
      if (settingsSnapshot.exists()) {
        const data = settingsSnapshot.data();
        setFaqs(data.faqs || DEFAULT_FAQS);
        setAiMode(data.aiMode !== undefined ? data.aiMode : true);
        setAnswerTimeRange(data.answerTimeRange || { start: '09:00', end: '18:00' });
      } else {
        await setDoc(settingsDoc, {
          faqs: DEFAULT_FAQS,
          aiMode: true,
          answerTimeRange: { start: '09:00', end: '18:00' }
        });
        setFaqs(DEFAULT_FAQS);
        setAiMode(true);
        setAnswerTimeRange({ start: '09:00', end: '18:00' });
      }
    } catch (err) {
      setError('설정을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Firestore에 FAQ/설정 저장
  const saveSettings = useCallback(async (newFaqs, aiModeVal, answerTimeRangeVal) => {
    try {
      setIsSaving(true);
      setError(null);
      const settingsDoc = doc(db, 'settings', CHATBOT_SETTINGS_DOC);
      await updateDoc(settingsDoc, {
        faqs: newFaqs,
        aiMode: aiModeVal,
        answerTimeRange: answerTimeRangeVal,
        updatedAt: new Date()
      });
      setFaqs(newFaqs);
      setAiMode(aiModeVal);
      setAnswerTimeRange(answerTimeRangeVal);
    } catch (err) {
      if (err.code === 'not-found' || err.message?.includes('No document to update')) {
        const settingsDoc = doc(db, 'settings', CHATBOT_SETTINGS_DOC);
        await setDoc(settingsDoc, {
          faqs: newFaqs,
          aiMode: aiModeVal,
          answerTimeRange: answerTimeRangeVal,
          updatedAt: new Date()
        });
        setFaqs(newFaqs);
        setAiMode(aiModeVal);
        setAnswerTimeRange(answerTimeRangeVal);
      } else {
        setError('설정 저장 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  // 폼 열기(편집/추가)
  const handleEdit = (idx) => {
    setEditIndex(idx);
    if (idx === 'new') {
      setForm({ question: '', answer: '', enabled: true });
    } else {
      setForm({ ...faqs[idx] });
    }
  };
  // 폼 입력 변경
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  // 폼 저장(추가/편집)
  const handleFormSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setError('질문과 답변을 모두 입력해주세요.');
      return;
    }
    let newFaqs;
    if (editIndex === 'new') {
      newFaqs = [...faqs, { ...form, id: form.question + '_' + Date.now() }];
    } else {
      newFaqs = faqs.map((f, i) => i === editIndex ? { ...form, id: f.id } : f);
    }
    await saveSettings(newFaqs, aiMode, answerTimeRange);
    setEditIndex(null);
    setForm({ question: '', answer: '', enabled: true });
  };
  // 폼 취소
  const handleFormCancel = () => {
    setEditIndex(null);
    setForm({ question: '', answer: '', enabled: true });
    setError(null);
  };
  // 삭제
  const handleDelete = async (idx) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const newFaqs = faqs.filter((_, i) => i !== idx);
    await saveSettings(newFaqs, aiMode, answerTimeRange);
    if (selectedExample === idx) setSelectedExample(0);
  };
  // 토글
  const handleToggle = async (idx) => {
    const newFaqs = faqs.map((f, i) => i === idx ? { ...f, enabled: !f.enabled } : f);
    await saveSettings(newFaqs, aiMode, answerTimeRange);
  };
  // AI 모드 토글
  const handleAiModeToggle = async () => {
    const newMode = !aiMode;
    setAiMode(newMode);
    await saveSettings(faqs, newMode, answerTimeRange);
  };
  // 고급 설정 열기/닫기
  const handleOpenAdvanced = () => {
    setRangeInput(answerTimeRange);
    setShowAdvanced(true);
  };
  const handleCloseAdvanced = () => {
    setShowAdvanced(false);
  };
  // 시간대 저장
  const handleSaveTimeRange = async () => {
    setAnswerTimeRange(rangeInput);
    await saveSettings(faqs, aiMode, rangeInput);
    setShowAdvanced(false);
  };

  // 예시로 보여줄 질문/답변
  const enabledFaqs = faqs.filter(f => f.enabled);
  const exampleIdx = enabledFaqs.length > 0 ? (selectedExample < enabledFaqs.length ? selectedExample : 0) : 0;
  const exampleFaq = enabledFaqs[exampleIdx] || faqs[0];

  // 로딩
  if (isLoading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">⚙️ AI 챗봇 설정</h2>
      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      <div className="flex gap-6">
        {/* 왼쪽: FAQ 관리 */}
        <div className="flex-[2] bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">자주 묻는 질문 설정</h3>
            <button onClick={() => handleEdit('new')} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">질문 추가</button>
          </div>
          <div>
            {faqs.map((faq, idx) => (
              <div key={faq.id} className={`border-b border-gray-200 py-3 flex items-center ${faq.enabled ? '' : 'opacity-60'}`}>
                {editIndex === idx ? (
                  <div className="w-full flex flex-col gap-2">
                    <input
                      name="question"
                      value={form.question}
                      onChange={handleFormChange}
                      className="border rounded p-2 text-sm mb-1"
                      placeholder="질문을 입력하세요"
                    />
                    <textarea
                      name="answer"
                      value={form.answer}
                      onChange={handleFormChange}
                      className="border rounded p-2 text-sm"
                      rows={2}
                      placeholder="답변을 입력하세요"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <label className="flex items-center text-xs gap-1">
                        <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleFormChange} /> 활성화
                      </label>
                      <div className="flex gap-2 ml-auto">
                        <button onClick={handleFormCancel} className="px-3 py-1 border rounded hover:bg-gray-100">취소</button>
                        <button onClick={handleFormSave} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 cursor-pointer" onClick={() => setSelectedExample(enabledFaqs.findIndex(f => f.id === faq.id))}>
                      <div className="font-medium text-gray-800 mb-1">{faq.question}</div>
                      <div className="text-sm text-gray-600">{faq.answer}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={() => handleEdit(idx)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">편집</button>
                      <button onClick={() => handleDelete(idx)} className="px-3 py-1 text-sm border text-red-400 hover:bg-red-50">삭제</button>
                      <label className="relative inline-flex items-center cursor-pointer ml-2">
                        <input type="checkbox" className="sr-only peer" checked={faq.enabled} onChange={() => handleToggle(idx)} />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                      </label>
                    </div>
                  </>
                )}
              </div>
            ))}
            {/* 추가 폼 */}
            {editIndex === 'new' && (
              <div className="border-b border-gray-200 py-3 flex items-center">
                <div className="w-full flex flex-col gap-2">
                  <input
                    name="question"
                    value={form.question}
                    onChange={handleFormChange}
                    className="border rounded p-2 text-sm mb-1"
                    placeholder="질문을 입력하세요"
                  />
                  <textarea
                    name="answer"
                    value={form.answer}
                    onChange={handleFormChange}
                    className="border rounded p-2 text-sm"
                    rows={2}
                    placeholder="답변을 입력하세요"
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <label className="flex items-center text-xs gap-1">
                      <input type="checkbox" name="enabled" checked={form.enabled} onChange={handleFormChange} /> 활성화
                    </label>
                    <div className="flex gap-2 ml-auto">
                      <button onClick={handleFormCancel} className="px-3 py-1 border rounded hover:bg-gray-100">취소</button>
                      <button onClick={handleFormSave} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">저장</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* 오른쪽: 예시/설정 */}
        <div className="flex-1 bg-white rounded-lg shadow p-6 h-fit">
          {/* AI 채팅 모드 토글 */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">💬 고객에게 보이는 응답 예시</h4>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${aiMode ? 'text-blue-700' : 'text-gray-400'}`}>AI 채팅 모드</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={aiMode} onChange={handleAiModeToggle} disabled={isSaving} />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors peer-disabled:opacity-50"></div>
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
          <div className="border border-gray-200 p-4 rounded bg-gray-50 text-sm mb-4">
            <strong className="text-gray-800">질문:</strong>
            <span className="text-gray-600 ml-1">
              {exampleFaq ? exampleFaq.question : '질문을 선택해주세요.'}
            </span>
            <br /><br />
            <strong className="text-gray-800">AI 답변:</strong><br />
            <span className="text-gray-700 leading-relaxed">
              {exampleFaq ? exampleFaq.answer : '답변을 선택해주세요.'}
            </span>
          </div>
          {/* 활성화 상태 표시 */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h5 className="font-medium text-blue-800 mb-2">활성화된 답변</h5>
            <div className="space-y-1">
              {enabledFaqs.length === 0 && <div className="text-sm text-gray-400">활성화된 답변이 없습니다.</div>}
              {enabledFaqs.map((f, i) => (
                <div key={f.id} className={`flex items-center text-sm cursor-pointer ${i === exampleIdx ? 'font-bold text-blue-700' : ''}`} onClick={() => setSelectedExample(i)}>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-gray-700">{f.question}</span>
                </div>
              ))}
            </div>
          </div>
          {/* AI 자동 답변 가능 시간대 설정 */}
          <div className="flex justify-end">
            <button
              onClick={handleOpenAdvanced}
              className="px-6 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700 transition-colors"
            >
              AI 자동 답변 가능 시간대 설정
            </button>
          </div>
        </div>
      </div>
      {/* 고급 설정 모달 (밝은 배경) */}
      {showAdvanced && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md border border-gray-200">
            <h3 className="text-lg font-bold mb-4">AI 자동 답변 가능 시간대</h3>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">답변 가능 시간</label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={rangeInput.start}
                  onChange={e => setRangeInput(r => ({ ...r, start: e.target.value }))}
                  className="border rounded p-1 text-center"
                />
                <span className="mx-2 text-gray-500">~</span>
                <input
                  type="time"
                  value={rangeInput.end}
                  onChange={e => setRangeInput(r => ({ ...r, end: e.target.value }))}
                  className="border rounded p-1 text-center"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">이 시간대에만 AI 자동 답변이 전송됩니다. (예: 09:00 ~ 18:00)</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseAdvanced}
                className="px-4 py-1 border rounded hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleSaveTimeRange}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isSaving}
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotSettings;
