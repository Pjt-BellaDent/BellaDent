import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import Modal from '../../../components/web/Modal.jsx';
import Title from '../../../components/web/Title.jsx';
import Button from '../../../components/web/Button';
import { auth } from '../../../config/firebase.jsx'; // 이 import는 현재 컴포넌트에서 직접 사용되지 않습니다.

function UserInfo() {
  const navigate = useNavigate();
  const { userInfo, userToken, signOutUser } = useUserInfo();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success', 'error', 'choice'
  const [detailedUserInfo, setDetailedUserInfo] = useState(null); // 상세 사용자 정보를 저장할 상태

  // 컴포넌트 마운트 시 사용자 상세 정보 불러오기
  useEffect(() => {
    const fetchDetailedUserInfo = async () => {
      if (!userInfo || !userInfo.id || !userToken) {
        console.warn(
          '사용자 정보 또는 토큰이 없어 상세 정보를 불러올 수 없습니다.'
        );
        return;
      }

      try {
        const url = `http://localhost:3000/users/${userInfo.id}`;
        console.log(`사용자 상세 정보 요청: GET ${url}`);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        });

        if (response.status === 200 && response.data.userInfo) {
          setDetailedUserInfo(response.data.userInfo);
        } else {
          console.warn(
            '상세 사용자 정보를 불러오는데 실패했거나 데이터가 없습니다.',
            response
          );
          setModalType('error');
          setModalMessage('사용자 상세 정보를 불러오는데 실패했습니다.');
          setShowModal(true);
        }
      } catch (err) {
        console.error('사용자 상세 정보 불러오기 중 오류 발생:', err);
        setModalType('error');
        setModalMessage(
          `사용자 상세 정보 불러오기 중 오류 발생: ${err.message}`
        );
        setShowModal(true);
      }
    };

    fetchDetailedUserInfo();
  }, [userInfo, userToken]); // userInfo 또는 userToken이 변경될 때마다 실행

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
    setModalType('choice'); // confirm 대신 choice 타입 모달
    setModalMessage('정말로 회원탈퇴를 진행 하시겠습니까?');
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">내 정보</h1>

      {detailedUserInfo ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>이름:</strong> {detailedUserInfo.name}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>이메일:</strong> {detailedUserInfo.email}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">
              <strong>역할:</strong> {detailedUserInfo.role}
            </p>
          </div>
          {detailedUserInfo.phone && (
            <div className="mb-4">
              <p className="text-gray-600">
                <strong>전화번호:</strong> {detailedUserInfo.phone}
              </p>
            </div>
          )}
          {detailedUserInfo.address && (
            <div className="mb-4">
              <p className="text-gray-600">
                <strong>주소:</strong> {detailedUserInfo.address}
              </p>
            </div>
          )}
          {/* 필요에 따라 다른 정보들을 추가할 수 있습니다. */}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          사용자 정보를 불러오는 중입니다...
        </p>
      )}

      <Button
        variant="primary"
        size="lg"
        className="mx-auto w-full mb-4"
        onClick={() => navigate('/user-update')}
      >
        회원정보수정
      </Button>

      <Button
        variant="danger"
        size="lg"
        className="mx-auto w-full"
        onClick={handleDisabled}
      >
        회원탈퇴
      </Button>

      {/* 모달 렌더링 로직 */}
      {showModal && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={
            modalType === 'choice'
              ? () => {
                  setShowModal(false);
                  requestDisabled();
                }
              : modalType === 'success'
              ? async () => {
                  setShowModal(false);
                  console.log(
                    '회원탈퇴 성공 모달 닫힘. 로그아웃 및 페이지 이동.'
                  );
                  await signOutUser();
                  navigate('/');
                }
              : // modalType === 'error'
                () => {
                  setShowModal(false);
                }
          }
          activeClose={
            modalType === 'choice'
              ? () => {
                  setShowModal(false);
                }
              : undefined
          }
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}
    </div>
  );
}

export default UserInfo;
