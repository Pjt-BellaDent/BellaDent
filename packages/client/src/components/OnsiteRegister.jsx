// src/components/OnsiteRegister.jsx  
import React, { useState } from 'react';
import axios from '../libs/axiosInstance.js';
import Button from './web/Button';

const generateTemporaryAuth = (phone) => {
  const timestamp = new Date().getTime();
  const base =
    phone && phone.length >= 8
      ? phone.replace(/[^0-9]/g, '').slice(-8)
      : String(timestamp).slice(-8);
  const email = `temp_${base}@belladent.com`;
  const password = `tempPass${Math.random().toString(36).substring(2, 8)}`;
  return { email, password };
};

const OnsiteRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    birth: '',
    gender: '',
    phone: '',
    address: '',
    email: '',
    insuranceNumber: '',
    allergies: '',
    medications: '',
    memo: '',
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendSms = async (
    patientPhone,
    patientName,
    patientEmail,
    patientPassword,
    firebaseUserId
  ) => {
    const send_phone = '010-1234-5678';

    if (!userToken) {
      console.error('로그인 정보가 없어 SMS를 발송할 수 없습니다.');
      return;
    }
    if (!send_phone) {    
      console.error('발신번호를 불러올 수 없어 SMS를 발송할 수 없습니다.');
      return;
    }
    if (!firebaseUserId) {
      console.error('Firebase User ID가 없어 SMS를 발송할 수 없습니다.');
      return;
    }

    const messageBody = `안녕하세요 ${patientName}님!\nBellaDent에 환자로 등록되셨습니다.\n아이디(이메일): ${patientEmail}\n임시 비밀번호: ${patientPassword}\n로그인 후 비밀번호를 변경해주세요.`;

    try {
      const smsData = {
        senderId: 'admin',
        smsLogType: '진료알림',
        destId: [firebaseUserId],
        dest_phone: [patientPhone],
        send_phone: send_phone,
        msg_body: messageBody,
        msg_ad: 'N',
      };

      const response = await axios.post('/sms/send', smsData);

      if (response.status === 201) {
        console.log(`SMS 발송 성공: ${patientName} (${patientPhone})`);
      } else {
        console.warn(
          `SMS 발송 실패: ${patientName} - ${response.data?.message}`
        );
      }
    } catch (err) {
      console.error(
        `SMS 발송 중 오류 발생: ${patientName} - `,
        err.response?.data || err
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.name ||
      !formData.birth ||
      !formData.gender ||
      !formData.phone
    ) {
      alert('이름, 생년월일, 성별, 전화번호는 필수 입력 항목입니다.');
      setLoading(false);
      return;
    }

    let patientEmail = formData.email.trim();
    let patientPassword = '';

    if (!patientEmail) {
      const { email, password } = generateTemporaryAuth(formData.phone);
      patientEmail = email;
      patientPassword = password;
      console.log('임시 이메일/비밀번호 생성:', patientEmail, patientPassword);
    } else {  
      patientPassword = `tempPass${Math.random().toString(36).substring(2, 8)}`;
      console.log(
        '입력된 이메일 사용, 임시 비밀번호 생성:',
        patientEmail,
        patientPassword
      );
    }

    const payload = {
      role: 'patient',
      email: patientEmail,
      password: patientPassword,
      name: formData.name,
      birth: formData.birth,
      gender:
        formData.gender === '남'
          ? 'M'
          : formData.gender === '여'
          ? 'F'
          : formData.gender,
      phone: formData.phone,
      address: formData.address || '',
      patientInfo: {
        insuranceNumber: formData.insuranceNumber || '',
        allergies: formData.allergies || '',
        medications: formData.medications || '',
        memo: formData.memo || '',
      },
    };

    console.log('최종 제출 payload:', payload);

    try {
      const res = await axios.post('/users/patient', payload);

      if (res.status === 201) {
        alert('현장 접수 및 환자 계정 생성 성공');

        const createdUserId = res.data.userId;

        sendSms(
          formData.phone,
          formData.name,
          patientEmail,
          patientPassword,
          createdUserId
        );

        setPatients((prev) => [
          { ...formData, id: createdUserId || Date.now() },
          ...prev,
        ]);
        setFormData({
          name: '',
          birth: '',
          gender: '',
          phone: '',
          address: '',
          email: '',
          insuranceNumber: '',
          allergies: '',
          medications: '',
          memo: '',
        });
      } else {
        alert('현장 접수 실패: ' + res.data?.message || '알 수 없는 오류');
      }
    } catch (err) {
      console.error('현장 접수 에러:', err.response?.data || err);
      const errorMessage = err.response?.data?.message || err.message;
      alert(`현장 접수 실패: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-10 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-lg font-sans">
        <h2 className="text-2xl font-bold text-center mb-2.5">현장 접수</h2>
        <p className="text-center text-gray-600 mb-10">
          환자 기본 정보 및 진료 관련 정보를 입력해 주세요.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              이름 *
            </label>
            <input
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="birth"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              생년월일 *
            </label>
            <input
              type="date"
              name="birth"
              id="birth"
              value={formData.birth}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="gender"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              성별 *
            </label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            >
              <option value="">선택</option>
              <option value="M">남</option>
              <option value="F">여</option>
            </select>
          </div>
          <div className="mb-5">
            <label
              htmlFor="phone"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              전화번호 *
            </label>
            <input
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              이메일 (환자 확인 시 입력)
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
              placeholder="확인된 이메일 주소를 입력해주세요"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="address"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              주소
            </label>
            <input
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>

          <h3 className="text-xl font-bold mt-10 mb-4 text-center">
            진료 관련 정보
          </h3>
          <div className="mb-5">
            <label
              htmlFor="insuranceNumber"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              의료보험 번호
            </label>
            <input
              name="insuranceNumber"
              id="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="allergies"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              알레르기
            </label>
            <textarea
              name="allergies"
              id="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="medications"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              복용 중인 약
            </label>
            <textarea
              name="medications"
              id="medications"
              value={formData.medications}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="memo"
              className="block mb-2 font-semibold text-gray-800 text-sm"
            >
              메모
            </label>
            <textarea
              name="memo"
              id="memo"
              value={formData.memo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
            />
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? '접수 중...' : '접수'}
          </Button>
        </form>

        <h3 className="text-xl font-bold mt-10 mb-4 text-center">접수 목록</h3>
        {!Array.isArray(patients) || patients.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            접수된 환자가 아직 없습니다.
          </p>
        ) : (
          <table className="w-full mt-5 border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 text-center bg-gray-100">
                  이름
                </th>
                <th className="border border-gray-300 p-3 text-center bg-gray-100">
                  전화번호
                </th>
                <th className="border border-gray-300 p-3 text-center bg-gray-100">
                  생년월일
                </th>
                <th className="border border-gray-300 p-3 text-center bg-gray-100">
                  성별
                </th>
                <th className="border border-gray-300 p-3 text-center bg-gray-100">
                  주소
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p, i) => (
                <tr key={p.id || i}>
                  <td className="border border-gray-300 p-3 text-center">
                    {p?.name || '-'}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {p?.phone || '-'}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {p?.birth || '-'}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {p?.gender || '-'}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {p?.address || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OnsiteRegister;
