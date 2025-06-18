import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// 스타일 정의
const Container = styled.div`
  padding: 30px;
  background-color: #f8f9fc;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${({ color }) => color || '#007bff'};
  color: white;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${({ color }) =>
      color === '#dc3545' ? '#c82333' : '#0056b3'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
`;

const Th = styled.th`
  background-color: #6699cc;
  color: white;
  padding: 12px;
  font-size: 14px;
  text-align: center;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
`;

const MessageInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  margin-bottom: 20px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 20px;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  background-color: ${({ active }) => (active ? '#007bff' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const SearchInput = styled.input`
  padding: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
`;

// 모달 캘린더
const CalendarOverlay = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
`;

const CalendarBox = styled.div`
  background: #1a1a1a;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  color: white;
`;

const DarkCalendarWrapper = styled.div`
  .react-calendar {
    background: #1a1a1a;
    border: none;
    color: #fff;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .react-calendar__navigation {
    background: transparent;
    margin-bottom: 1rem;
  }

  .react-calendar__navigation button {
    background: transparent !important;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    transition: color 0.2s ease;
  }

  .react-calendar__navigation button:hover:enabled {
    color: #f87171; /* 은은한 hover 효과 */
  }

  .react-calendar__navigation button:disabled {
    color: #888;
    cursor: default;
    opacity: 0.4;
  }

  .react-calendar__tile {
    color: #fff;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .react-calendar__tile:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .react-calendar__tile--now {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    font-weight: bold;
  }

  .react-calendar__tile--active {
    background: rgba(255, 255, 255, 0.2);
    color: inherit;
  }

  .react-calendar__month-view__weekdays {
    color: #ccc;
    text-align: center;
    font-weight: 500;
  }
`;
// 날짜 관련
const SmsBroadcast = () => {
  const [patients, setPatients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [calendarShow, setCalendarShow] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    const fetchPatients = async () => {
      const snapshot = await getDocs(collection(db, 'patients'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPatients(data);
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      (p.name || '').includes(searchTerm.trim()) ||
      (p.phone || '').includes(searchTerm.trim())
  );

  const totalPages = Math.ceil(filteredPatients.length / pageSize);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const allIds = filteredPatients.map((p) => p.id);
    const allSelected = allIds.every((id) => selected.includes(id));
    setSelected(allSelected ? [] : allIds);
  };

  const insertAd = () => {
    setMessage('(광고) 안녕하세요 BellaDent 치과입니다!');
  };

  const insertRevisit = () => {
    setCalendarShow(true);
  };

  const getKoreanDay = (dateStr) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleDateSelect = (date) => {
    const formatted = formatDate(date);
    const day = getKoreanDay(formatted);
    const content = `안녕하세요! BellaDent 치과입니다!\n${formatted} (${day})요일은 님의 재진일입니다!`;
    setMessage(content);
    setCalendarShow(false);
  };

  const sendSms = async () => {
    if (!message.trim()) return alert('메시지를 입력하세요.');
    if (selected.length === 0) return alert('수신 대상을 선택하세요.');

    try {
      const selectedPatients = patients.filter((p) => selected.includes(p.id));
      const destPhones = selectedPatients.map((p) => p.phone);
      const destIds = selectedPatients.map((p) => p.id);

      const smsData = {
        senderId: 'admin',
        smsLogType: message.includes('(광고)') ? '광고' : '진료알림',
        destId: destIds,
        dest_phone: destPhones,
        send_phone: '010-1234-5678',
        msg_body: message,
        msg_ad: message.includes('(광고)') ? 'Y' : 'N',
      };

      const response = await axios.post('http://localhost:3000/sms/send', smsData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        alert(`총 ${selected.length}명에게 문자 발송 완료`);
        setMessage('');
      } else {
        alert('발송 실패: ' + response.data?.message);
      }
    } catch (err) {
      console.error(err);
      alert('오류 발생: ' + err.message);
    }
  };

  return (
    <Container>
      <Title>📱 단체 문자 발송</Title>

      <div style={{ marginBottom: '20px' }}>
        <Button onClick={insertAd}>📢 광고 보내기</Button>
        <Button onClick={toggleAll} color="#6c757d">전체 선택</Button>
        <Button onClick={insertRevisit} color="#17a2b8">재진 안내</Button>
      </div>

      <SearchInput
        type="text"
        placeholder="이름 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <thead>
          <tr>
            <Th>선택</Th>
            <Th>이름</Th>
            <Th>전화번호</Th>
          </tr>
        </thead>
        <tbody>
          {paginatedPatients.map((p) => (
            <tr key={p.id}>
              <Td>
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                />
              </Td>
              <Td>{p.name}</Td>
              <Td>{p.phone}</Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PageButton>
        ))}
      </Pagination>

      <MessageInput
        placeholder="메시지를 입력하세요 (최대 80자)"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 80))}
      />

      <div>
        <Button onClick={sendSms}>발송</Button>
        <Button color="#dc3545" onClick={() => setMessage('')}>초기화</Button>
      </div>

      <CalendarOverlay show={calendarShow} onClick={() => setCalendarShow(false)}>
        <CalendarBox onClick={(e) => e.stopPropagation()}>
          <DarkCalendarWrapper>
            <Calendar
              onClickDay={handleDateSelect}
              locale="ko-KR"
              calendarType="gregory"
            />
          </DarkCalendarWrapper>
        </CalendarBox>
      </CalendarOverlay>
    </Container>
  );
};

export default SmsBroadcast;