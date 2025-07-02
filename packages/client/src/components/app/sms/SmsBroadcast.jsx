// src/components/app/sms/SmsBroadcast.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../../libs/axiosInstance.js';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';

const SmsBroadcast = () => {
  const { userToken } = useUserInfo();

  const [patients, setPatients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [sendingPhone, setSendingPhone] = useState('');
  const [sendPhoneLoading, setSendPhoneLoading] = useState(true);
  const [sendPhoneError, setSendPhoneError] = useState(null);

  const [isAdMessage, setIsAdMessage] = useState(false);

  const AD_MESSAGE_TEMPLATE = '(광고) 안녕하세요 BellaDent 치과입니다!';

  useEffect(() => {
    const fetchSendingNumber = async () => {
      if (!userToken) {
        setSendPhoneError('로그인 정보가 없어 발신번호를 불러올 수 없습니다.');
        setSendPhoneLoading(false);
        return;
      }
      setSendPhoneLoading(true);
      setSendPhoneError(null);
      try {
        const response = await axios.get('/sms/number', {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        });
        if (
          response.status === 200 &&
          response.data.content &&
          response.data.content.number
        ) {
          setSendingPhone(response.data.content.number);
        } else {
          setSendPhoneError(
            '발신번호를 불러오지 못했습니다: 응답 데이터 불충분.'
          );
        }
      } catch (err) {
        console.error('발신번호 조회 중 오류 발생:', err);
        setSendPhoneError('발신번호 조회 중 오류가 발생했습니다.');
      } finally {
        setSendPhoneLoading(false);
      }
    };

    fetchSendingNumber();
  }, [userToken]);

  const searchPatientsByName = async () => {
    if (!searchTerm.trim()) {
      alert('검색할 이름을 입력해주세요.');
      return;
    }
    if (!userToken) {
      alert('로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
      return;
    }

    setLoading(true);
    setSearchError(null);
    setSearchExecuted(true);
    setPatients([]);
    setCurrentPage(1);

    try {
      const response = await axios.get(
        `/users/patient/name/${searchTerm.trim()}`
      );

      if (response.status === 200 && response.data.patientInfo) {
        setPatients(response.data.patientInfo);
      } else {
        setPatients([]);
        setSearchError('검색된 환자 정보가 없습니다.');
      }
    } catch (err) {
      console.error('환자 검색 중 오류 발생:', err);
      setPatients([]);
      setSearchError(
        err.response?.data?.message || '환자 검색 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
      setSearchTerm('');
    }
  };

  const pageSize = 10;
  const paginatedPatients = patients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(patients.length / pageSize);

  const toggleSelectRecipient = (patient) => {
    setSelectedRecipients((prev) => {
      const isSelected = prev.some((p) => p.id === patient.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== patient.id);
      } else {
        return [...prev, patient];
      }
    });
  };

  const removeRecipient = (patientId) => {
    setSelectedRecipients((prev) => prev.filter((p) => p.id !== patientId));
  };

  const handleAdCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsAdMessage(checked);
    if (checked) {
      setMessage(AD_MESSAGE_TEMPLATE);
    } else {
      if (message.startsWith(AD_MESSAGE_TEMPLATE)) {
        setMessage('');
      }
    }
  };

  const sendSms = async () => {
    if (!message.trim()) {
      alert('메시지를 입력하세요.');
      return;
    }
    if (selectedRecipients.length === 0) {
      alert('수신 대상을 선택하세요.');
      return;
    }
    if (!userToken) {
      alert('로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
      return;
    }
    if (!sendingPhone) {
      alert('발신번호를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      const destPhones = selectedRecipients.map((p) => p.phone);
      const destIds = selectedRecipients.map((p) => p.id);

      const smsData = {
        senderId: 'admin',
        smsLogType: isAdMessage ? '광고' : '진료알림',
        destId: destIds,
        dest_phone: destPhones,
        send_phone: sendingPhone,
        msg_body: message,
        msg_ad: isAdMessage ? 'Y' : 'N',
      };

      const response = await axios.post('/sms/send', smsData);

      if (response.status === 201) {
        alert(`총 ${selectedRecipients.length}명에게 문자 발송 완료`);
        setMessage('');
        setSelectedRecipients([]);
        setPatients([]);
        setSearchExecuted(false);
        setSearchTerm('');
        setIsAdMessage(false);
      } else {
        alert(
          '발송 실패: ' +
            (response.data?.message || '알 수 없는 오류 발생') +
            (response.data?.apiError
              ? ` (API 오류: ${response.data.apiError})`
              : '')
        );
      }
    } catch (err) {
      console.error(err);
      alert('오류 발생: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <h2 className="text-2xl font-semibold mb-5 text-gray-800">sms 발송</h2>

      <div className="mb-5 flex items-center">
        <input
          type="checkbox"
          id="isAdMessage"
          checked={isAdMessage}
          onChange={handleAdCheckboxChange}
          className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out mr-2"
        />
        <label htmlFor="isAdMessage" className="text-sm text-gray-700">
          광고 메시지 포함
        </label>
      </div>

      <div className="mb-5 text-gray-700">
        <span className="font-semibold">발신번호: </span>
        {sendPhoneLoading ? (
          <span className="text-sm text-gray-500">불러오는 중...</span>
        ) : sendPhoneError ? (
          <span className="text-sm text-red-500">{sendPhoneError}</span>
        ) : (
          <span className="text-sm text-blue-700">{sendingPhone}</span>
        )}
      </div>

      <div className="flex space-x-2 mb-5">
        <input
          type="text"
          placeholder="환자 이름 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              searchPatientsByName();
            }
          }}
          className="flex-grow px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={searchPatientsByName}
          className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
        >
          검색
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">
                선택
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                전화번호
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  환자 정보를 검색 중입니다...
                </td>
              </tr>
            ) : searchError ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-4 text-center text-sm text-red-500"
                >
                  {searchError}
                </td>
              </tr>
            ) : searchExecuted && paginatedPatients.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  검색된 환자 정보가 없습니다.
                </td>
              </tr>
            ) : !searchExecuted ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  이름을 입력하여 환자를 검색해주세요.
                </td>
              </tr>
            ) : (
              paginatedPatients.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.some(
                        (rec) => rec.id === p.id
                      )}
                      onChange={() => toggleSelectRecipient(p)}
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-800">
                    {p.phone}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {patients.length > 0 && (
        <div className="flex justify-center space-x-1 mb-5">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 text-sm rounded ${
                i + 1 === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="mb-5 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          선택된 수신인 ({selectedRecipients.length}명)
        </h3>
        {selectedRecipients.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedRecipients.map((recipient) => (
              <span
                key={recipient.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {recipient.name} ({recipient.phone})
                <button
                  type="button"
                  onClick={() => removeRecipient(recipient.id)}
                  className="ml-2 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">수신인을 선택해주세요.</p>
        )}
      </div>

      <textarea
        placeholder="메시지를 입력하세요 (최대 80자)"
        value={message}
        onChange={(e) => {
          const newValue = e.target.value.slice(0, 80);
          setMessage(newValue);
          if (isAdMessage && !newValue.startsWith(AD_MESSAGE_TEMPLATE)) {
            setIsAdMessage(false);
          }
        }}
        className="w-full h-28 p-3 text-sm border border-gray-300 rounded-md resize-none shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-5"
      ></textarea>

      <div className="flex space-x-2">
        <button
          onClick={sendSms}
          className="px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          발송
        </button>
        <button
          onClick={() => {
            setMessage('');
            setIsAdMessage(false);
          }}
          className="px-5 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
        >
          초기화
        </button>
      </div>
    </div>
  );
};

export default SmsBroadcast;
