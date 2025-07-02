// src/components/web/ReservationForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { addAppointment } from '../../api/patients';
import { fetchAllStaff } from '../../api/scheduleApi';
import { fetchDetailedUserInfoById } from '../../api/auth';
import { useUserInfo } from '../../contexts/UserInfoContext';

import axios from '../../libs/axiosInstance.js';
import Modal from './Modal.jsx';
import Title from './Title';

const pad = (n) => String(n).padStart(2, '0');
const formatDateToYYYYMMDD = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

const HOUR_MAP = Array.from({ length: 18 }, (_, i) => {
  const hour = 9 + Math.floor(i / 2);
  const minute = (i % 2) * 30;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
});

const PROCEDURE_MAP = {
  보철과: ['라미네이트', '임플란트', '올세라믹 크라운'],
  교정과: ['클리피씨 교정', '투명교정', '설측교정'],
  치주과: ['치석제거', '치근활택술', '치은성형술'],
  심미치료: ['라미네이트', '잇몸성형', '전문가 미백'],
  '교정/미백': ['클리피씨 교정', '투명교정', '전문가 미백'],
  '일반 진료/보철': ['스케일링', '충치치료', '임플란트'],
};

const getYearList = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 100 }, (_, i) => currentYear - i);
};
const getMonthList = () =>
  Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const getDayList = (year, month) => {
  if (!year || !month) return [];
  const daysInMonth = new Date(year, parseInt(month, 10), 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
};

const DEPARTMENT_TO_CHAIR = {
  보철과: '1',
  교정과: '2',
  치주과: '3',
  심미치료: '4',
  구강외과: '5',
  소아치과: '6',
  통합치의학과: '7',
  '일반 진료/보철': '1',
  '교정/미백': '2',
};

const ReservationForm = ({ open, onClose, selectedDate, onSaveSuccess }) => {
  const { isLogin, userInfo } = useUserInfo();
  const [detailedUserInfo, setDetailedUserInfo] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    birth: '',
    gender: '',
    date: selectedDate || '',
    department: '',
    doctor: '',
    title: '',
    startTime: '',
    memo: '',
  });

  const [staffList, setStaffList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  const availableDoctors = useMemo(() => {
    if (!form.department) return [];
    return staffList.filter((staff) => staff.department === form.department);
  }, [form.department, staffList]);

  useEffect(() => {
    const initializeFormAndLoadData = async () => {
      setLoading(true);
      setError(null);
      try {
        setForm((prevForm) => ({
          ...prevForm,
          date: selectedDate || '',
          name: '',
          phone: '',
          birth: '',
          gender: '',
          department: '',
          doctor: '',
          title: '',
          startTime: '',
          memo: '',
        }));
        setBirthYear('');
        setBirthMonth('');
        setBirthDay('');

        if (isLogin && userInfo?.id) {
          const fetchedDetailedInfo = await fetchDetailedUserInfoById(
            userInfo.id
          );
          setDetailedUserInfo(fetchedDetailedInfo);
          setForm((prevForm) => ({
            ...prevForm,
            name: fetchedDetailedInfo.name || '',
            phone: fetchedDetailedInfo.phone || '',
            birth: fetchedDetailedInfo.birth || '',
            gender: fetchedDetailedInfo.gender || '',
          }));
          if (fetchedDetailedInfo.birth) {
            const [year, month, day] = fetchedDetailedInfo.birth.split('-');
            setBirthYear(year);
            setBirthMonth(month);
            setBirthDay(day);
          }
        }

        const fetchedStaff = await fetchAllStaff();
        setStaffList(fetchedStaff);

        if (selectedDate) {
          const monthString = formatDateToYYYYMMDD(
            new Date(selectedDate)
          ).slice(0, 7);

          const fetchedAppointmentsResponse = await axios.get('/appointments', {
            params: { month: monthString },
          });
          const fetchedAppointments = fetchedAppointmentsResponse.data;

          setAppointments(fetchedAppointments);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error('데이터 로드 실패:', err);
        setError('예약 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (open && selectedDate) {
      initializeFormAndLoadData();
    } else if (!open) {
      setAppointments([]);
      setDetailedUserInfo(null);
    }
  }, [open, selectedDate, isLogin, userInfo]);

  useEffect(() => {
    if (birthYear && birthMonth && birthDay) {
      setForm((prev) => ({
        ...prev,
        birth: `${birthYear}-${birthMonth}-${birthDay}`,
      }));
    } else {
      setForm((prev) => ({ ...prev, birth: '' }));
    }
  }, [birthYear, birthMonth, birthDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'department') {
      setForm((prev) => ({ ...prev, doctor: '', title: '', startTime: '' }));
    } else if (name === 'doctor') {
      setForm((prev) => ({ ...prev, startTime: '' }));
    }
  };

  const bookedTimeSlots = useMemo(() => {
    if (!selectedDate || !form.department || !form.doctor || !staffList.length)
      return new Set();

    const selectedDoctor = staffList.find((s) => s.name === form.doctor);
    const selectedDoctorUid = selectedDoctor?.uid;

    if (!selectedDoctorUid) return new Set();

    const booked = appointments
      .filter(
        (app) =>
          formatDateToYYYYMMDD(new Date(app.date)) === selectedDate &&
          app.department === form.department &&
          app.doctorUid === selectedDoctorUid
      )
      .map((app) => app.startTime);

    return new Set(booked);
  }, [selectedDate, form.department, form.doctor, appointments, staffList]);

  const handleTimeSelect = (time) => {
    setForm((prev) => ({ ...prev, startTime: time, endTime: time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalName = isLogin ? detailedUserInfo?.name || form.name : form.name;
    const finalPhone = isLogin
      ? detailedUserInfo?.phone || form.phone
      : form.phone;
    const finalBirth = isLogin
      ? detailedUserInfo?.birth || form.birth
      : form.birth;
    const finalGender = isLogin
      ? detailedUserInfo?.gender || form.gender
      : form.gender;

    if (
      !finalName ||
      !finalPhone ||
      !finalBirth ||
      !finalGender ||
      !form.date ||
      !form.department ||
      !form.doctor ||
      !form.title ||
      !form.startTime
    ) {
      setModalType('error');
      setModalMessage('모든 필수 정보를 입력해주세요.');
      setShowModal(true);
      return;
    }

    const selectedDoctor = staffList.find((s) => s.name === form.doctor);
    const selectedDoctorUid = selectedDoctor?.uid;
    const selectedChairNumber =
      selectedDoctor?.chairNumber ||
      DEPARTMENT_TO_CHAIR[form.department] ||
      '1';

    if (!selectedDoctorUid) {
      setModalType('error');
      setModalMessage('담당의 정보를 찾을 수 없습니다.');
      setShowModal(true);
      return;
    }

    try {
      const payload = {
        name: finalName,
        phone: finalPhone,
        birth: finalBirth,
        gender: finalGender,
        date: form.date,
        department: form.department,
        doctor: form.doctor,
        doctorUid: selectedDoctorUid,
        chairNumber: selectedChairNumber,
        title: form.title,
        startTime: form.startTime,
        endTime: form.startTime,
        memo: form.memo,
        patientUid: isLogin ? userInfo.id : null,
        status: '대기',
      };

      const result = await addAppointment(payload);
      console.log('예약 성공:', result);
      onSaveSuccess();
    } catch (err) {
      console.error('예약 실패:', err.response?.data || err.message);
      setModalType('error');
      setModalMessage(
        '예약에 실패했습니다: ' +
          (err.response?.data?.message || '알 수 없는 오류')
      );
      setShowModal(true);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="p-6 relative flex-grow overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center">
              진료 예약하기
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin ? (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      이름
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                      placeholder="이름을 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      연락처
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                      placeholder="연락처를 입력하세요"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      생년월일
                    </label>
                    <div className="flex gap-2">
                      {[
                        [birthYear, setBirthYear, getYearList(), '년'],
                        [birthMonth, setBirthMonth, getMonthList(), '월'],
                        [
                          birthDay,
                          setBirthDay,
                          getDayList(birthYear, birthMonth),
                          '일',
                        ],
                      ].map(([value, setter, options, unit], i) => (
                        <select
                          key={i}
                          value={value || ''}
                          onChange={(e) => setter(e.target.value)}
                          className="flex-1 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:border-blue-500"
                          required
                        >
                          <option value="">{unit}</option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                              {unit}
                            </option>
                          ))}
                        </select>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      성별
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                      required
                    >
                      <option value="">선택</option>
                      <option value="M">남</option>
                      <option value="F">여</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="space-y-2 text-sm text-gray-700 p-3 bg-gray-50 rounded-md">
                  <p>
                    <b>이름:</b> {detailedUserInfo?.name || '정보 없음'}
                  </p>
                  <p>
                    <b>연락처:</b> {detailedUserInfo?.phone || '정보 없음'}
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      생년월일
                    </label>
                    {detailedUserInfo?.birth ? (
                      <p className="font-bold">{detailedUserInfo.birth}</p>
                    ) : (
                      <div className="flex gap-2">
                        {[
                          [birthYear, setBirthYear, getYearList(), '년'],
                          [birthMonth, setBirthMonth, getMonthList(), '월'],
                          [
                            birthDay,
                            setBirthDay,
                            getDayList(birthYear, birthMonth),
                            '일',
                          ],
                        ].map(([value, setter, options, unit], i) => (
                          <select
                            key={i}
                            value={value || ''}
                            onChange={(e) => setter(e.target.value)}
                            className="flex-1 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:border-blue-500"
                            required={!detailedUserInfo?.birth}
                          >
                            <option value="">{unit}</option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                                {unit}
                              </option>
                            ))}
                          </select>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      성별
                    </label>
                    {detailedUserInfo?.gender ? (
                      <p className="font-bold">
                        {detailedUserInfo.gender === 'M' ? '남' : '여'}
                      </p>
                    ) : (
                      <select
                        id="gender"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                        required={!detailedUserInfo?.gender}
                      >
                        <option value="">선택</option>
                        <option value="M">남</option>
                        <option value="F">여</option>
                      </select>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    회원 정보는 자동으로 입력됩니다. 없는 정보는 직접
                    입력해주세요.
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  예약일
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={form.date}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 bg-gray-100"
                  readOnly
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700"
                  >
                    진료과
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                    required
                  >
                    <option value="">진료과 선택</option>
                    {[
                      ...new Set(
                        staffList
                          .map((s) => s.department)
                          .filter((dep) => dep && dep.trim() !== '')
                      ),
                    ].map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="doctor"
                    className="block text-sm font-medium text-gray-700"
                  >
                    담당의
                  </label>
                  <select
                    id="doctor"
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    disabled={!form.department}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                    required
                  >
                    <option value="">담당의 선택</option>
                    {availableDoctors.map((doc) => (
                      <option key={doc.uid} value={doc.name}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  시술명
                </label>
                <select
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  disabled={!form.department}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5"
                  required
                >
                  <option value="">시술 선택</option>
                  {(PROCEDURE_MAP[form.department] || []).map((proc) => (
                    <option key={proc} value={proc}>
                      {proc}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  예약 시간
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {HOUR_MAP.map((time) => {
                    const isBooked = bookedTimeSlots.has(time);
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`py-2 text-sm font-medium rounded transition-colors
                          ${
                            form.startTime === time
                              ? 'bg-blue-500 text-white'
                              : isBooked
                              ? 'bg-red-200 text-red-700 cursor-not-allowed opacity-70'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                        disabled={
                          !form.date ||
                          !form.department ||
                          !form.doctor ||
                          isBooked
                        }
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label
                  htmlFor="memo"
                  className="block text-sm font-medium text-gray-700"
                >
                  메모 (선택 사항)
                </label>
                <textarea
                  id="memo"
                  name="memo"
                  value={form.memo}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 resize-y"
                  placeholder="특별히 전달할 내용을 입력하세요"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2.5 rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  예약 요청
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showModal && modalType === 'error' && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={() => setShowModal(false)}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}
    </>
  );
};

export default ReservationForm;
