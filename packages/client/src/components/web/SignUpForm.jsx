import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../libs/axiosInstance.js';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';
import Button from '../web/Button';

function SignUpForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_check: '',
    name: '',
    phone: '',
    address: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
    setModalMessage('');
    setModalType('');

    try {
      if (formData.password !== formData.password_check) {
        setModalType('error');
        setModalMessage('비밀번호가 일치하지 않습니다. 다시 확인하세요.');
        setShowModal(true);
        return;
      }
      const url = '/users/signUp';
      const response = await axios.post(url, {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (response.status === 201) {
        setModalType('success');
        setModalMessage('회원가입이 완료되었습니다.');
        setShowModal(true);
      } else {
        setModalType('error');
        setModalMessage(`회원가입 중 예상치 못한 응답: ${response.status}`);
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      let displayMessage = '회원가입 중 알 수 없는 오류가 발생했습니다.';

      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 400:
            displayMessage =
              err.response.data.message || '입력값이 형식을 벗어났습니다.';
            break;
          case 409:
            displayMessage =
              err.response.data.message || '이미 사용중인 이메일입니다.';
            break;
          default:
            displayMessage = `회원가입 중 오류 발생: ${
              err.response.data.message || err.message
            }`;
            break;
        }
      } else {
        displayMessage = `회원가입 중 오류 발생: ${err.message}`;
      }

      setModalType('error');
      setModalMessage(displayMessage);
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="px-20 py-15 absolute top-1/2 left-1/2 transform -translate-1/2 shadow-xl bg-BD-PureWhite text-BD-CharcoalBlack text-md font-BD-sans">
        <form className="min-w-140" onSubmit={handleSubmit}>
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
              placeholder="example@email.com"
              required
              onChange={handleChange}
              className="w-full flex-6 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold"
            />
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="password" className="block text-nowrap">
                비밀번호
              </label>
            </div>
            <input
              type="password"
              name="password"
              id="password"
              minLength={6}
              required
              onChange={handleChange}
              className="w-full flex-6 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray  focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold"
            />
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="password_check" className="block text-nowrap">
                비밀번호 확인
              </label>
            </div>
            <input
              type="password"
              name="password_check"
              id="password_check"
              required
              onChange={handleChange}
              className="w-full flex-6 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray  focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold"
            />
            {formData.password_check &&
              formData.password !== formData.password_check && (
                <span className="absolute text-xs text-red-600 right-3 top-1/2 -translate-y-1/2">
                  비밀번호를 확인하세요
                </span>
              )}
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="name" className="block text-nowrap">
                이름
              </label>
            </div>
            <input
              type="text"
              name="name"
              id="name"
              required
              onChange={handleChange}
              className="w-full flex-6 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray  focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold"
            />
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="phone" className="block text-nowrap">
                연락처
              </label>
            </div>
            <input
              type="text"
              name="phone"
              id="phone"
              maxLength={13}
              required
              placeholder="01X-XXXX-XXXX"
              onChange={handleChange}
              className="w-full flex-6 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray  focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold"
            />
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="address" className="block text-nowrap">
                주소
              </label>
            </div>
            <input
              type="text"
              name="address"
              id="address"
              onChange={handleChange}
              className="w-full flex-6 px-6 py-2 rounded outline-1 -outline-offset-1 bg-BD-WarmBeige outline-BD-CoolGray  focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold"
            />
          </div>

          <div className="flex items-center justify-center mt-4">
            <Button
              type="submit"
              size="lg"
              variant="positive"
              className="w-full"
            >
              등록
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
            navigate('/');
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

export default SignUpForm;
