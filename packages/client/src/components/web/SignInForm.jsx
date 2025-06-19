import { useState, useEffect } from 'react';
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

function SignInForm() {
  const navigate = useNavigate();
  const { isLogin, userInfo, signOutUser } = useUserInfo();
  const [comment, setComment] = useState('로그인중 입니다.');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [pendingLogin, setPendingLogin] = useState(false); // 로그인 후 userInfo 대기

  useEffect(() => {
    // 로그인 시도 후 userInfo가 갱신되면 분기 처리
    if (pendingLogin && userInfo) {
      if (userInfo.isActive === false) {
        setModalType('error');
        setModalMessage('비활성화된 계정입니다. 관리자에게 문의하세요.');
        setShowModal(true);
        setPendingLogin(false);
        signOutUser();
      } else if (userInfo.isActive === true) {
        setModalType('success');
        setModalMessage(`${userInfo.name}님 환영합니다.`);
        setShowModal(true);
        setPendingLogin(false);
      }
    }
  }, [pendingLogin, userInfo, signOutUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) return;

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setPendingLogin(true);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error('로그인 실패:', errorCode, errorMessage);

      switch (errorCode) {
        case 'auth/invalid-email':
          // 유효하지 않은 이메일 형식 처리
          setModalType('error');
          setModalMessage('유효하지 않은 이메일 주소 형식입니다.');
          setShowModal(true);
          break;
        case 'auth/user-not-found':
          // 사용자 없음 처리
          setModalType('error');
          setModalMessage('등록되지 않은 이메일 주소입니다.');
          setShowModal(true);
          break;
        case 'auth/wrong-password':
          // 비밀번호 오류 처리
          setModalType('error');
          setModalMessage('비밀번호가 틀렸습니다.');
          setShowModal(true);
          break;
        case 'auth/user-disabled':
          // 계정 비활성화 처리
          setModalType('error');
          setModalMessage(
            '사용자 계정이 비활성화되었습니다. 관리자에게 문의하세요.'
          );
          setShowModal(true);
          break;
        case 'auth/too-many-requests':
          // 과도한 시도 처리
          setModalType('error');
          setModalMessage(
            '로그인을 너무 여러 번 시도하여 계정이 잠겼습니다. 잠시 후 다시 시도해주세요.'
          );
          setShowModal(true);
          break;
        default:
          // 기타 오류 처리
          setModalType('error');
          setModalMessage('로그인 중 오류가 발생했습니다: ' + errorMessage);
          setShowModal(true);
      }
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
            <button
              type="submit"
              className="w-full px-6 py-3 text-lg rounded bg-BD-CharcoalBlack text-BD-ElegantGold hover:bg-BD-ElegantGold hover:text-BD-CharcoalBlack duration-300 cursor-pointer"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
      {modalType === 'success' && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={() => {
            setShowModal(false);
            if (
              userInfo?.role === 'staff' ||
              userInfo?.role === 'manager' ||
              userInfo?.role === 'admin'
            ) {
              navigate('/');
            } else {
              navigate('/Dashboard');
            }
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
            setFormData({ email: '', password: '' });
            navigate(0);
          }}
        >
          <Title>{modalMessage}</Title>
        </Modal>
      )}
    </>
  );
}

export default SignInForm;
