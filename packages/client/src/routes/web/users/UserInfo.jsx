import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import Modal from '../../../components/web/Modal.jsx';
import Title from '../../../components/web/Title.jsx';
import { auth } from '../../../config/firebase.jsx';

function UserInfo() {
  const navigate = useNavigate();
  const { userInfo, userToken, signOutUser } = useUserInfo();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  const requestDisabled = async () => {
    if (!userInfo || !userInfo.id) {
      console.error('사용자 정보가 없어 회원탈퇴 요청을 보낼 수 없습니다.');
      setModalType('error');
      setModalMessage('사용자 정보를 불러올 수 없습니다.');
      setShowModal(true);
      return;
    }

    try {
      const url = `http://localhost:3000/users/disabled/${userInfo.id}`;
      console.log(`회원탈퇴 요청: PUT ${url}`);

      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log('회원탈퇴 (계정 비활성화) 요청 성공:', response.data);
        setModalType('success');
        setModalMessage('회원탈퇴가 완료되었습니다.');
        setShowModal(true);
      } else {
        console.warn(
          `회원탈퇴 요청 성공했으나 예상치 못한 상태 코드: ${response.status}`,
          response.data
        );
        setModalType('error');
        setModalMessage(
          `회원탈퇴 중 예상치 못한 응답이 발생했습니다. 상태 코드: ${response.status}`
        );
        setShowModal(true);
      }
    } catch (err) {
      console.error('회원탈퇴 요청 중 오류 발생:', err);
      setModalType('error');
      const errorMessage = err.response?.data?.message || err.message;
      setModalMessage(`회원탈퇴 중 오류가 발생했습니다: ${errorMessage}`);
      setShowModal(true);
    }
  };

  const handleDisabled = () => {
    if (!userInfo || !userInfo.id) {
      setModalType('error');
      setModalMessage('사용자 정보를 불러올 수 없어 탈퇴할 수 없습니다.');
      setShowModal(true);
      return;
    }
    setModalType('choice');
    setModalMessage(
      '정말로 회원탈퇴를 진행 하시겠습니까?'
    );
    setShowModal(true);
  };

  return (
    <>
      <button className="mx-auto w-full">
        <Link to={'/user-update'}>회원정보수정</Link>
      </button>
      <button
        className="mx-auto w-full cursor-pointer"
        onClick={handleDisabled}
      >
        회원탈퇴
      </button>

      {modalType === 'choice' && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={() => {
            setShowModal(false);
            requestDisabled();
          }}
          activeClose={() => {
            setShowModal(false);
          }}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}

      {modalType === 'success' && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={async () => {
            setShowModal(false);
            console.log('회원탈퇴 성공 모달 닫힘. 로그아웃 및 페이지 이동.');
            await signOutUser();
            navigate('/');
          }}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}

      {modalType === 'error' && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={() => {
            setShowModal(false);
          }}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}
    </>
  );
}

export default UserInfo;
