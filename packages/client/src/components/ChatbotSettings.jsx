import React, { useState } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 30px;
`;

const SettingsContainer = styled.div`
  display: flex;
  gap: 30px;
`;

const SettingsList = styled.div`
  flex: 2;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 12px 0;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 8px;
`;

const Button = styled.button`
  background: ${({ primary }) => (primary ? '#007bff' : '#f6f6f6')};
  color: ${({ primary }) => (primary ? '#fff' : '#000')};
  border: 1px solid #ccc;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 8px;
  cursor: pointer;
`;

const ToggleSwitch = styled.label`
  position: relative;
  width: 40px;
  height: 20px;

  input {
    display: none;
  }

  span {
    position: absolute;
    top: 0; left: 0;
    right: 0; bottom: 0;
    background-color: #ccc;
    border-radius: 20px;
    transition: .4s;
  }

  span::before {
    content: "";
    position: absolute;
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: .4s;
  }

  input:checked + span {
    background-color: #007bff;
  }

  input:checked + span::before {
    transform: translateX(20px);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 8px;
  margin-top: 8px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
`;

const Preview = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);

  .preview-box {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
    background: #f9f9f9;
    font-size: 14px;
  }
`;

const ChatbotSettings = () => {
  const defaultAnswers = {
    접수: '진료 접수는 방문 또는 전화로 가능합니다.',
    예약: '예약 변경은 24시간 전에 연락 주시면 처리됩니다.',
    검사: '검사 결과는 진료 후 마이페이지에서 확인 가능합니다.',
    진료비: '진료비는 시술 항목에 따라 상이하니 전화문의 주세요.',
    시간: '평일 9시~18시 / 토요일 9시~13시 운영, 일요일/공휴일 휴무입니다.'
  };

  const [toggles, setToggles] = useState({
    접수: true,
    예약: false,
    검사: true,
    진료비: false,
    시간: true
  });

  const [answers, setAnswers] = useState(defaultAnswers);
  const [editBuffer, setEditBuffer] = useState(defaultAnswers);
  const [selectedKey, setSelectedKey] = useState('시간');

  const toggleChange = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditClick = (key) => {
    setSelectedKey(key);
    setEditBuffer(prev => ({ ...prev, [key]: answers[key] }));
  };

  const handleAnswerChange = (key, value) => {
    setEditBuffer(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key) => {
    setAnswers(prev => ({ ...prev, [key]: editBuffer[key] }));
    setSelectedKey(null);
  };

  const handleCancel = (key) => {
    setEditBuffer(prev => ({ ...prev, [key]: answers[key] }));
    setSelectedKey(null);
  };

  return (
    <Container>
      <h2>⚙️ AI 챗봇 설정</h2>

      <SettingsContainer>
        <SettingsList>
          <h3>자주 묻는 질문 설정</h3>
          {Object.entries({
            접수: '진료 접수 방법',
            예약: '예약 변경 방법',
            검사: '검사 결과 조회',
            진료비: '진료비 문의',
            시간: '진료 시간'
          }).map(([key, label]) => (
            <div key={key}>
              <Row>
                <span>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button onClick={() => handleEditClick(key)}>답변 편집</Button>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={toggles[key]}
                      onChange={() => toggleChange(key)}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                </div>
              </Row>
              {selectedKey === key && (
                <Column>
                  <Textarea
                    value={editBuffer[key]}
                    onChange={(e) => handleAnswerChange(key, e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button onClick={() => handleCancel(key)}>취소</Button>
                    <Button primary onClick={() => handleSave(key)}>저장</Button>
                  </div>
                </Column>
              )}
            </div>
          ))}
        </SettingsList>

        <Preview>
          <h4>💬 고객에게 보이는 응답 예시</h4>
          <div className="preview-box">
            <strong>질문:</strong> {selectedKey ? `${selectedKey} 관련 질문` : ''}<br /><br />
            <strong>AI 답변:</strong><br />
            {answers[selectedKey]}
          </div>
        </Preview>
      </SettingsContainer>
    </Container>
  );
};

export default ChatbotSettings;
