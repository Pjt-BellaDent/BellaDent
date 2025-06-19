import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';

function ReviewCreateForm({ activeReview, setActiveReview }) {
  const navigate = useNavigate();
  const { userInfo, userToken } = useUserInfo();
  const [inputData, setInputData] = useState({
    review: '',
  });
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('review', inputData.review);
    formData.append('author', userInfo.id);
    formData.append('createdAt', new Date());
    images.forEach((image) => {
      formData.append('reviewImg', image);
    });
    try {
      const url = `http://localhost:3000/reviews/`;

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
        withCredentials: true,
      });
      if (response.status === 201) {
        setModalType('success');
        setModalMessage('이용 후기가 등록되었습니다.');
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setModalType('error');
      setModalMessage('err');
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setActiveReview(!activeReview);
  };

  return (
    <>
      <div className="mt-10 mx-auto w-full max-w-300">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <label
              htmlFor="review"
              className="block text-sm/6 font-medium text-BD-CharcoalBlack flex-1/4"
            >
              후기
            </label>
            <div className="mt-2 flex-3/4">
              <textarea
                name="review"
                id="review"
                value={inputData.review}
                onChange={handleChange}
                className="block w-full h-120 rounded-md bg-BD-PureWhite px-3 py-1.5 text-base text-BD-CharcoalBlack outline-1 -outline-offset-1 outline-BD-SoftGrayLine placeholder:text-BD-SoftGrayLine focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="reviewImg"
              className="block text-sm/6 font-medium text-BD-CharcoalBlack flex-1/4"
            >
              이미지 첨부
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAddImages}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-BD-CharcoalBlack outline-1 -outline-offset-1 outline-BD-SoftGrayLine placeholder:text-BD-SoftGrayLine focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold sm:text-sm/6"
              />
              <div className="flex flex-wrap gap-4 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`product-${index}`}
                      className="w-24 h-24 rounded border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    ></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded text-xl bg-BD-CharcoalBlack text-BD-ElegantGold hover:bg-BD-ElegantGold hover:text-BD-CharcoalBlack duration-300 cursor-pointer"
            >
              등록
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 rounded text-xl bg-BD-SoftGrayLine text-BD-CoolGray hover:bg-BD-CancelGrayHover hover:text-BD-CharcoalBlack duration-300 cursor-pointer"
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
            navigate('/reviews');
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

export default ReviewCreateForm;
