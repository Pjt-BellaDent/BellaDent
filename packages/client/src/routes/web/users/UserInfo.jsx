import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import axios from '../../../libs/axiosInstance.js';
import Modal from '../../../components/web/Modal.jsx';
import Title from '../../../components/web/Title.jsx';
import Button from '../../../components/web/Button';

function UserInfo() {
  const navigate = useNavigate();
  const { userInfo, userToken, signOutUser } = useUserInfo();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [detailedUserInfo, setDetailedUserInfo] = useState(null);

  useEffect(() => {
    const fetchDetailedUserInfo = async () => {
      if (!userInfo || !userInfo.id || !userToken) {
        return;
      }

      try {
        const url = `/users/${userInfo.id}`;

        const response = await axios.get(url);

        if (response.status === 200 && response.data.userInfo) {
          setDetailedUserInfo(response.data.userInfo);
        } else {
          setModalType('error');
          setModalMessage('사용자 상세 정보를 불러오는데 실패했습니다.');
          setShowModal(true);
        }
      } catch (err) {
        setModalType('error');
        setModalMessage(
          `사용자 상세 정보 불러오기 중 오류 발생: ${err.message}`
        );
        setShowModal(true);
      }
    };

    fetchDetailedUserInfo();
  }, [userInfo, userToken]);

  const requestDisabled = async () => {
    if (!userInfo || !userInfo.id) {
      setModalType('error');
      setModalMessage(
        '사용자 정보를 불러올 수 없어 회원탈퇴 요청을 보낼 수 없습니다.'
      );
      setShowModal(true);
      return;
    }

    try {
      const url = `/disabled/${userInfo.id}`;

      const response = await axios.put(url);

      if (response.status === 200) {
        setModalType('success');
        setModalMessage('회원탈퇴가 완료되었습니다.');
        setShowModal(true);
      } else {
        setModalType('error');
        setModalMessage(
          `회원탈퇴 중 예상치 못한 응답이 발생했습니다. 상태 코드: ${response.status}`
        );
        setShowModal(true);
      }
    } catch (err) {
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
    setModalMessage('정말로 회원탈퇴를 진행 하시겠습니까?');
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">내 정보</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 사진 영역 (왼쪽) */}
        <div className="flex-1 p-6 bg-white shadow-md rounded-lg flex items-center justify-center">
          <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            사진 영역 (추후 추가)
          </div>
        </div>

        {/* 회원 정보 내용 (오른쪽) */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          {detailedUserInfo ? (
            <>
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
            </>
          ) : (
            <p className="text-center text-gray-500">
              사용자 정보를 불러오는 중입니다...
            </p>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="positive"
              size="lg"
              className="max-w-[150px]"
              onClick={() => navigate('/user-update')}
            >
              회원정보수정
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="max-w-[150px]"
              onClick={handleDisabled}
            >
              회원탈퇴
            </Button>
          </div>
        </div>
      </div>

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
                  await signOutUser();
                  navigate('/');
                }
              : () => {
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
