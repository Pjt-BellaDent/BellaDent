import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import Modal from '../../../components/web/Modal.jsx';
import Title from '../../../components/web/Title.jsx';

function UserInfo() {
  const navigate = useNavigate();
  const { userInfo, userToken, signOutUser } = useUserInfo;
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  const handleDisabled = async () => {
    try {
      confirm('정말로 회원탈퇴를 진행 하시겠습니까?');
      const url = `http://localhost:3000/users/disabled/${userInfo.id}`;
      const response = await axios.put(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        withCredentials: true,
      });
      if (response.status === 201) {
        signOutUser();
        setModalType('success');
        setModalMessage('회원탈퇴가 완료되었습니다.');
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setModalType('error');
      setModalMessage(err);
      setShowModal(true);
    }
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
      {modalType === 'success' && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={() => {
            setShowModal(false);
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
            navigate(0);
          }}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}
    </>
  );
}

export default UserInfo;
