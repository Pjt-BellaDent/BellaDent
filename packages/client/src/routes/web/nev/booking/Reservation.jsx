import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../../../contexts/UserInfoContext.jsx';

import LineImageBanner from '../../../../components/web/LineImageBanner';
import Container from '../../../../components/web/Container';
import Title from '../../../../components/web/Title';
import Text from '../../../../components/web/Text';
import Modal from '../../../../components/web/Modal.jsx'; // Modal 컴포넌트 추가

import ReservationCalendar from '../../../../components/web/ReservationCalendar';
import ReservationForm from '../../../../components/web/ReservationForm';

import line_banner from '../../../../assets/images/line_banner.png';

function Reservation() {
  const { isLogin, userInfo, loading: userInfoLoading } = useUserInfo();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(null);
  const [showReservationFormModal, setShowReservationFormModal] =
    useState(false); // 예약 폼 모달 표시 여부
  const [showNotificationModal, setShowNotificationModal] = useState(false); // 알림 모달 표시 여부
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState(''); // 'success', 'error'

  useEffect(() => {
    if (!userInfoLoading && !isLogin) {
      setNotificationType('error');
      setNotificationMessage('로그인 후 이용 가능한 페이지입니다.');
      setShowNotificationModal(true);
    }
  }, [isLogin, userInfoLoading, navigate]);

  const handleDateSelect = (dateString) => {
    setSelectedDate(dateString);
    setShowReservationFormModal(true);
  };

  const handleReservationSuccess = () => {
    setNotificationType('success');
    setNotificationMessage(
      '예약이 성공적으로 접수되었습니다. 확인 후 연락드리겠습니다.'
    );
    setShowNotificationModal(true);
    setShowReservationFormModal(false);
    setSelectedDate(null);
  };

  const handleCloseFormModal = () => {
    setShowReservationFormModal(false);
    setSelectedDate(null);
  };

  const handleNotificationModalConfirm = () => {
    setShowNotificationModal(false);
    if (
      !isLogin &&
      notificationType === 'error' &&
      notificationMessage === '로그인 후 이용 가능한 페이지입니다.'
    ) {
      navigate('/login');
    }
  };

  if (userInfoLoading || (!isLogin && !showNotificationModal)) {
    return null;
  }

  return (
    <>
      <LineImageBanner
        CN="w-full h-30 flex justify-center items-center overflow-hidden object-cover"
        image={line_banner}
      >
        <Title
          as="h2"
          size="lg"
          CN="text-center text-BD-CharcoalBlack text-shadow-lg/20"
        >
            온라인 예약
          </Title>
          <Text size="md" CN="text-center">
            Online reservations
          </Text>
      </LineImageBanner>

      <Container CN="py-10">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-300 mx-auto">
          <h3 className="text-xl font-semibold mb-4">예약 가능 시간 확인</h3>
          <ReservationCalendar onDateSelect={handleDateSelect} />
        </div>

        {showReservationFormModal && (
          <ReservationForm
            open={showReservationFormModal}
            onClose={handleCloseFormModal}
            selectedDate={selectedDate}
            onSaveSuccess={handleReservationSuccess}
          />
        )}
      </Container>

      {showNotificationModal && (
        <Modal
          show={showNotificationModal}
          setShow={setShowNotificationModal}
          activeClick={handleNotificationModalConfirm}
        >
          <Title>{notificationMessage}</Title>
        </Modal>
      )}
    </>
  );
}

export default Reservation;
