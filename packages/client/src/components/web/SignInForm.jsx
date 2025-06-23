import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import {
  signInWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { auth } from '../../config/firebase.jsx';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';
import Button from '../web/Button';

function SignInForm() {
  const navigate = useNavigate();
  const { isLogin, userInfo } = useUserInfo();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // 이미 로그인 상태일 때, 불필요한 재로그인 시도 방지
      setModalType('error');
      setModalMessage('이미 로그인되어 있습니다.');
      setShowModal(true);
      return;
    }

    // 모달 초기화
    setShowModal(false);
    setModalMessage('');
    setModalType('');

    try {
      await setPersistence(auth, browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      const idTokenResult = await user.getIdTokenResult();
      const claims = idTokenResult.claims;

      const isActive =
        claims && claims.isActive !== undefined ? claims.isActive : true;

      if (isActive === false) {
        setModalType('error');
        setModalMessage(
          '회원 계정이 비활성화되었습니다. 관리자에게 문의하세요.'
        );
        setShowModal(true);

        await auth.signOut(); // 비활성화 계정은 자동 로그아웃
        setFormData({ email: '', password: '' });
      } else {
        setModalType('success');
        setModalMessage('로그인에 성공했습니다.');
        setShowModal(true);
        setFormData({ email: '', password: '' }); // 폼 데이터 초기화
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      let displayMessage = '로그인 중 알 수 없는 오류가 발생했습니다.';

      switch (errorCode) {
        case 'auth/invalid-email':
          displayMessage = '유효하지 않은 이메일 주소 형식입니다.';
          break;
        case 'auth/user-not-found':
          displayMessage = '등록되지 않은 이메일 주소입니다.';
          break;
        case 'auth/wrong-password':
          displayMessage = '비밀번호가 틀렸습니다.';
          break;
        case 'auth/user-disabled':
          displayMessage =
            '사용자 계정이 비활성화되었습니다. 관리자에게 문의하세요.';
          break;
        case 'auth/too-many-requests':
          displayMessage =
            '로그인을 너무 여러 번 시도하여 계정이 일시적으로 잠겼습니다. 잠시 후 다시 시도해주세요.';
          break;
        default:
          displayMessage = `로그인 중 오류가 발생했습니다: ${errorMessage}`;
      }

      setModalType('error');
      setModalMessage(displayMessage);
      setShowModal(true);
      setFormData({ email: '', password: '' }); // 폼 데이터 초기화
    }
  };

  return (
    <>
      <div className="mx-auto max-w-full px-20 py-15 absolute top-1/2 left-1/2 transform -translate-1/2 shadow-xl bg-BD-PureWhite text-BD-CharcoalBlack text-md font-BD-sans">
        <form className="w-100" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="email" className="block text-nowrap">
                이메일
              </label>
            </div>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full flex-6 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray  focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold"
            />
          </div>
          <div className="flex items-center justify-between mb-12">
            <div className="flex-2">
              <label htmlFor="password" className="block text-nowrap">
                비밀번호
              </label>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full flex-6 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray  focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold"
            />
          </div>
          <div className="flex items-center justify-center">
            <Button type="submit" size="lg" className="w-full">
              로그인
            </Button>
          </div>
        </form>
      </div>

      {showModal && modalType === 'success' && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={() => {
            setShowModal(false);
            // 로그인 성공 후 페이지 이동 로직은 그대로 유지
            if (
              userInfo?.role === 'staff' ||
              userInfo?.role === 'manager' ||
              userInfo?.role === 'admin'
            ) {
              navigate('/Dashboard');
            } else {
              navigate('/');
            }
          }}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}

      {showModal && modalType === 'error' && (
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

export default SignInForm;
