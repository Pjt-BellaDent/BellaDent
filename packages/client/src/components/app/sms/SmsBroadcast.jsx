// src/app/sms/components/SmsBroadcast.jsx
import React, { useState } from 'react';
import axios from '../../../libs/axiosIntance';

const patientsMock = [
  { id: 1, name: '홍길동', phone: '010-1234-5678' },
  { id: 2, name: '김하나', phone: '010-5678-1234' },
  { id: 3, name: '이몽룡', phone: '010-2345-6789' },
];

const SmsBroadcast = () => {
  const [patients, setPatients] = useState(patientsMock);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState('');

  const toggleSelect = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((v) => v !== id)
        : [...selected, id]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === patients.length ? [] : patients.map(p => p.id));
  };

  const sendSms = async () => {
    if (!message.trim()) return alert('메시지를 입력하세요.');
    if (selected.length === 0) return alert('수신 대상을 선택하세요.');

    const recipients = patients
      .filter(p => selected.includes(p.id))
      .map(p => p.phone);

    try {
      await axios.post("/sms/send", {
        message,
        recipients,
      });
      alert(`총 ${selected.length}명에게 문자 발송 완료.`);
      setMessage('');
    } catch (err) {
      alert('문자 전송 실패');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">📱 단체 문자 발송</h2>

      <div className="flex gap-4 mb-6">
        <select className="p-2 border rounded">
          <option>진료일자 선택</option>
          <option>오늘</option>
          <option>이번주</option>
          <option>이번달</option>
        </select>
        <select className="p-2 border rounded">
          <option>진료과 선택</option>
          <option>치과</option>
          <option>소아과</option>
          <option>내과</option>
        </select>
        <select className="p-2 border rounded">
          <option>문자 유형</option>
          <option>진료 안내</option>
          <option>예약 알림</option>
          <option>프로모션</option>
        </select>
      </div>

      <button
        onClick={toggleAll}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        전체 선택
      </button>

      <table className="w-full mb-6 bg-white border shadow-sm">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-3">선택</th>
            <th className="p-3">이름</th>
            <th className="p-3">전화번호</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="text-center border-t">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleSelect(p.id)}
                />
              </td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <textarea
        className="w-full h-28 p-3 border rounded resize-none mb-4"
        placeholder="메시지를 입력하세요 (최대 80자)"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 80))}
      />

      <div>
        <button
          onClick={sendSms}
          className="px-4 py-2 bg-blue-600 text-white rounded mr-3 hover:bg-blue-700"
        >
          발송
        </button>
        <button
          onClick={() => setMessage('')}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          초기화
        </button>
      </div>
    </div>
  );
};

export default SmsBroadcast;
