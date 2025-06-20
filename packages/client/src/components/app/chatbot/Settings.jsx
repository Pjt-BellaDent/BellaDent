import React, { useState, useEffect } from 'react';
import { getChatbotSettings, updateChatbotSettings } from '../../../api/aiChatApi';

const Settings = () => {
  const [settings, setSettings] = useState({
    persona: '',
    guidelines: [],
    faqs: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await getChatbotSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to fetch chatbot settings:", error);
        alert('설정 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleGuidelineChange = (index, value) => {
    const newGuidelines = [...settings.guidelines];
    newGuidelines[index] = value;
    setSettings(prev => ({ ...prev, guidelines: newGuidelines }));
  };
  
  const addGuideline = () => {
    setSettings(prev => ({ ...prev, guidelines: [...prev.guidelines, ''] }));
  };
  
  const removeGuideline = (index) => {
    const newGuidelines = settings.guidelines.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, guidelines: newGuidelines }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...settings.faqs];
    newFaqs[index][field] = value;
    setSettings(prev => ({ ...prev, faqs: newFaqs }));
  };

  const addFaq = () => {
    setSettings(prev => ({ ...prev, faqs: [...prev.faqs, { question: '', answer: '' }] }));
  };

  const removeFaq = (index) => {
    const newFaqs = settings.faqs.filter((_, i) => i !== index);
    setSettings(prev => ({ ...prev, faqs: newFaqs }));
  };

  const handleSave = async () => {
    try {
      await updateChatbotSettings(settings);
      alert('설정이 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error("Failed to save chatbot settings:", error);
      alert('설정 저장에 실패했습니다.');
    }
  };
  
  if (isLoading) {
    return <div className="p-6">설정 정보를 불러오는 중...</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI 챗봇 설정</h1>
          <p className="mt-1 text-sm text-gray-600">챗봇의 응답 방식, 정보, 자주 묻는 질문을 관리합니다.</p>
        </header>

        <div className="space-y-10">
          {/* 페르소나 설정 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 border-b pb-3">페르소나</h2>
            <p className="text-sm text-gray-500 mb-4">챗봇의 기본 역할과 정체성을 정의합니다. (예: 친절한 치과 상담원)</p>
            <textarea
              name="persona"
              value={settings.persona}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* 응답 가이드라인 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold">응답 가이드라인</h2>
              <button onClick={addGuideline} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">+</button>
            </div>
            <div className="space-y-3">
              {settings.guidelines.map((guideline, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={guideline}
                    onChange={(e) => handleGuidelineChange(index, e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <button onClick={() => removeGuideline(index)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">-</button>
                </div>
              ))}
            </div>
          </div>
          
          {/* FAQ 설정 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold">FAQ (자주 묻는 질문)</h2>
              <button onClick={addFaq} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">+</button>
            </div>
            <div className="space-y-4">
              {settings.faqs.map((faq, index) => (
                <div key={index} className="border p-4 rounded-md space-y-2">
                  <div className="flex justify-end">
                    <button onClick={() => removeFaq(index)} className="text-red-500 text-xs hover:text-red-700">삭제</button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">질문 (Q)</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                      className="w-full p-2 border rounded-md mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">답변 (A)</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                      rows="4"
                      className="w-full p-2 border rounded-md mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
          >
            설정 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
