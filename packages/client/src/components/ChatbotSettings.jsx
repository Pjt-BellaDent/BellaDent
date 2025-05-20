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

const Button = styled.button`
  background: #f6f6f6;
  border: 1px solid #ccc;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 10px;
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
  const [toggles, setToggles] = useState({
    접수: true,
    예약: false,
    검사: true,
    진료비: false,
    시간: true
  });

  const toggleChange = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Container>
      <h2>⚙️ AI 챗봇 설정</h2>

      <SettingsContainer>
        <SettingsList>
          <h3>자주 묻는 질문 설정</h3>
          {[
            ['접수', '진료 접수 방법'],
            ['예약', '예약 변경 방법'],
            ['검사', '검사 결과 조회'],
            ['진료비', '진료비 문의'],
            ['시간', '진료 시간'],
          ].map(([key, label]) => (
            <Row key={key}>
              <span>{label}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button>답변 편집</Button>
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
          ))}
        </SettingsList>

        <Preview>
          <h4>💬 고객에게 보이는 응답 예시</h4>
          <div className="preview-box">
            <strong>질문:</strong> 진료 시간은 어떻게 되나요?<br /><br />
            <strong>AI 답변:</strong><br />
            저희 병원의 진료 시간은 평일 오전 9시부터 오후 6시까지이며,<br />
            토요일은 1시까지 운영됩니다. 일요일 및 공휴일은 휴진입니다.
          </div>
        </Preview>
      </SettingsContainer>
    </Container>
  );
};

export default ChatbotSettings;
