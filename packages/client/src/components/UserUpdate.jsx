import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInfoContext } from '../context/UserInfoContext.jsx';
import axios from 'axios';

function userUpdate() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserInfoContext);
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    name: '',
    phone: '',
    address: '',
  });
  useEffect(() => {
    const getUserInfo = async () => {
      if (userInfo) {
        try {
          const url = `http://localhost:3000/users/${userInfo.id}`;
          const response = await axios.get(url);
          if (response.status === 201) {
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
        }
      }
    };
    getUserInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:3000/users/${userInfo.id}`;
      const response = await axios
        .put(url, {
          id: formData.id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          updatedAt: new Date(),
        })
        .then((res) => {
          if (res.status === 201) {
            alert('회원정보가 수정되었습니다.');
            navigate(-1);
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  }

  return (
    <>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center">
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              이메일
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="email"
                name="email"
                id="email"
                readOnly
                defaultValue={formData.email}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              이름
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={formData.name}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="phone"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              연락처
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="phone"
                id="phone"
                maxLength={13}
                defaultValue={formData.phone}
                required
                placeholder="01X-XXXX-XXXX"
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="address"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              주소
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="address"
                id="address"
                defaultValue={formData.address}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default userUpdate;
