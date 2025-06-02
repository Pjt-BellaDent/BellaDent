import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../contexts/UserInfoContext.jsx';
import axios from 'axios';

function ReviewAddForm({ activeReviewAdd, setActiveReviewAdd }) {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();
  const [formData, setFormData] = useState({
    review: '',
    reviewImg: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:3000/users/${userInfo.id}`;
      const response = await axios
        .put(url, {
          review: formData.review,
          reviewImg: formData.reviewImg,
          author: userInfo.name,
          updatedAt: new Date(),
        })
        .then((res) => {
          if (res.status === 201) {
            alert('이용 후기가 등록되었습니다.');
            navigate(-1);
          }
        });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setActiveReviewAdd(!activeReviewAdd);
  };

  return (
    <>
      <div className="mt-10 mx-auto w-full max-w-300">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <label
              htmlFor="review"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              후기
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="textarea"
                name="review"
                id="review"
                defaultValue={formData.review}
                onChange={handleChange}
                className="block w-full h-120 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="reviewImg"
              className="block text-sm/6 font-medium text-gray-900 flex-1/4"
            >
              이미지 첨부
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="file"
                name="reviewImg"
                id="reviewImg"
                defaultValue={formData.reviewImg}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              className="flex w-40 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              등록
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex w-40 justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ReviewAddForm;
