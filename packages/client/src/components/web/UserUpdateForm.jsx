import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';

function UserUpdateForm() {
  const navigate = useNavigate();
  const { userInfo, userToken } = useUserInfo();
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    name: '',
    phone: '',
    address: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const getUserInfo = async () => {
      if (userInfo) {
        try {
          const url = `http://localhost:3000/users/${userInfo.id}`;
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
            withCredentials: true,
          });
          if (response.status === 200) {
            const data = response.data.userInfo;
            setFormData({
              ...formData,
              id: data.id,
              email: data.email,
              name: data.name,
              phone: data.phone,
              address: data.address,
            });
          }
        } catch (err) {
          console.error(err);
          setModalType('error');
          setModalMessage(err);
          setShowModal(true);
        }
      }
    };
    getUserInfo();
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:3000/users/${userInfo.id}`;
      const response = await axios
        .put(
          url,
          {
            id: formData.id,
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            updatedAt: new Date(),
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setModalType('success');
            setModalMessage('회원정보가 수정되었습니다.');
            setShowModal(true);
          }
        });
    } catch (err) {
      console.error(err);
      setModalType('error');
      setModalMessage(err);
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    navigate(-1);
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
            <div className="mt-2 flex-3/4">
              <input
                type="email"
                name="email"
                id="email"
                readOnly
                value={formData.email || ''}
                className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="name" className="block text-nowrap">
                이름
              </label>
            </div>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="name"
                id="name"
                readOnly
                value={formData.name || ''}
                required
                className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="phone" className="block text-nowrap">
                연락처
              </label>
            </div>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="phone"
                id="phone"
                maxLength={13}
                value={formData.phone || ''}
                required
                placeholder="01X-XXXX-XXXX"
                onChange={handleChange}
                className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex-2">
              <label htmlFor="address" className="block text-nowrap">
                주소
              </label>
            </div>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address || ''}
                onChange={handleChange}
                className="block w-full rounded-md px-4 py-2 outline-1 -outline-offset-1 bg-BD-SoftGrayLine outline-BD-CharcoalBlack placeholder:text-BD-CoolGray focus:outline-BD-PureWhite focus:bg-BD-PureWhite focus:text-BD-CharcoalBlack flex-6 duration-300"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center rounded-md bg-BD-CharcoalBlack text-BD-ElegantGold outline-2 -outline-offset-2 outline-BD-CharcoalBlack py-3 shadow-xs hover:bg-BD-ElegantGold  hover-visible:outline-BD-ElegantGold hover:text-BD-CharcoalBlack focus:bg-BD-ElegantGold  focus-visible:outline-BD-ElegantGold focus:text-BD-CharcoalBlack duration-300"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full flex items-center justify-center rounded-md bg-BD-CoolGray text-BD-SoftGrayLine outline-2 -outline-offset-2 outline-BD-CoolGray py-3 shadow-xs hover:bg-BD-SoftGrayLine  hover-visible:outline-BD-SoftGrayLine hover:text-BD-CoolGray focus:bg-BD-SoftGrayLine  focus-visible:outline-BD-SoftGrayLine focus:text-BD-CoolGray duration-300"
            >
              취소
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
            navigate(-1);
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

export default UserUpdateForm;
