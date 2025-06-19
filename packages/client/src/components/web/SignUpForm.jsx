import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';

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
    try {
      if (formData.password !== formData.password_check) {
        alert('비밀번호가 일치하지 않습니다. 다시 확인하세요.');
        return;
      }
      const url = 'http://localhost:3000/users/signUp';
      const response = await axios
        .post(
          url,
          {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
          }
        )
        .then((res) => {
          if (res.status === 201) {
            setModalType('success');
            setModalMessage('회원가입이 완료되었습니다.');
            setShowModal(true);
          }
        });
    } catch (err) {
      if (err.status === 404) {
        setModalType('error');
        setModalMessage('이미 사용중인 이메일입니다.');
        setShowModal(true);
      } else if (err.status === 400) {
        setModalType('error');
        setModalMessage('입력값이 형식을 벗어났습니다.');
        setShowModal(true);
      }
      console.error(err);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-full px-20 py-20 absolute top-1/2 left-1/2 transform -translate-1/2 rounded-2xl shadow-xl bg-BD-SoftGrayLine text-BD-CharcoalBlack text-lg">
        <form className="w-120" onSubmit={handleSubmit}>
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
              className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
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
              className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
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
              className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
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
              className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
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
              className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
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
              className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
            />
          </div>
          <div className="flex items-center justify-center mt-12">
            <div className="flex gap-3 items-center">
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    id="comments"
                    name="comments"
                    type="checkbox"
                    required
                    aria-describedby="comments-description"
                    className="col-start-1 row-start-1 appearance-none rounded-sm border border-BD-CoolGray bg-BD-PureWhite checked:border-BD-CharcoalBlack checked:bg-BD-CharcoalBlack indeterminate:border-BD-CharcoalBlack indeterminate:bg-BD-CharcoalBlack focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-BD-CharcoalBlack disabled:border-BD-PureWhite disabled:bg-BD-PureWhite disabled:checked:bg-BD-PureWhite forced-colors:appearance-auto"
                  />
                  <svg
                    fill="none"
                    viewBox="0 0 14 14"
                    className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-BD-ElegantGold group-has-disabled:stroke-BD-CharcoalBlack"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-checked:opacity-100"
                    />
                    <path
                      d="M3 7H11"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-0 group-has-indeterminate:opacity-100"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-sm">
                <label htmlFor="comments">이용약관</label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              type="submit"
              className="w-full flex justify-center rounded-md bg-BD-CharcoalBlack text-BD-ElegantGold outline-2 -outline-offset-2 outline-BD-CharcoalBlack py-3 shadow-xs hover:bg-BD-ElegantGold  hover-visible:outline-BD-ElegantGold hover:text-BD-CharcoalBlack focus:bg-BD-ElegantGold  focus-visible:outline-BD-ElegantGold focus:text-BD-CharcoalBlack duration-300"
            >
              등록
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

export default SignUpForm;
