import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase.jsx';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';

function SignInForm() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, setUserToken } = useUserInfo();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const idToken = await userCredential.user.getIdToken();

      const url = 'http://localhost:3000/users/signIn';
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          withCredentials: true,
        }
      );
      setModalType('success'); // 성공 모달 타입 설정
      setUserToken(idToken);
      setUserInfo(res.data.userInfo);
      setModalMessage(res.data.message);
      setShowModal(true);
    } catch (error) {
      // 로그인 실패!
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
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="signin-form space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              이메일
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                비밀번호
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  비밀번호를 잊어버리셨나요?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              로그인
            </button>
          </div>
        </form>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Not a member?
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
      {modalType === 'success' && (
        <Modal
          show={showModal}
          setShow={setShowModal}
          activeClick={() => {
            setShowModal(false);
            if (userInfo?.role === 'patient') {
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
