import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axios from '../../libs/axiosInstance.js';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';
import Button from '../web/Button';

function ReviewUpdateForm({
  postId,
  activeReview,
  setActiveReview,
  onReviewUpdated,
}) {
  const navigate = useNavigate();
  const { userToken } = useUserInfo();
  const [inputData, setInputData] = useState({
    title: '',
    content: '',
  });
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!postId || !userToken) {
        return;
      }
      try {
        const url = `/reviews/single/${postId}`;
        const response = await axios.get(url);

        const reviewData = response.data;

        setInputData({
          title: reviewData.title || '',
          content: reviewData.content || '',
        });
        setImages(reviewData.imageUrls || []);
      } catch (error) {
        setModalType('error');
        setModalMessage(
          error.response?.data?.message ||
            '기존 리뷰를 불러오는 데 실패했습니다.'
        );
        setShowModal(true);
      }
    };

    fetchReviewData();
  }, [postId, userToken]);

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (indexToRemove) => {
    const imgToRemove = images[indexToRemove];

    if (typeof imgToRemove === 'string') {
      setImagesToDelete((prev) => [...prev, imgToRemove]);
    }
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
    setModalMessage('');
    setModalType('');

    if (!inputData.title.trim() || !inputData.content.trim()) {
      setModalType('error');
      setModalMessage('제목과 후기 내용을 모두 입력해주세요.');
      setShowModal(true);
      return;
    }

    const formData = new FormData();
    formData.append('title', inputData.title);
    formData.append('content', inputData.content);

    images.forEach((image) => {
      if (image instanceof File) {
        formData.append('reviewImg', image);
      }
    });

    imagesToDelete.forEach((url) => {
      formData.append('deleteImageUrls', url);
    });

    try {
      const url = `/reviews/${postId}`;
      const response = await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setModalType('success');
        setModalMessage('이용 후기가 수정되었습니다.');
        setShowModal(true);

        setActiveReview(false);

        if (onReviewUpdated) {
          onReviewUpdated();
        }
      } else {
        setModalType('error');
        setModalMessage(
          `이용 후기 수정 중 예상치 못한 응답: ${response.status}`
        );
        setShowModal(true);
      }
    } catch (err) {
        setModalType('error');
        setModalMessage(
        err.response?.data?.message || '이용 후기 수정 중 오류가 발생했습니다.'
      );
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    setActiveReview(false);
  };

  return (
    <>
      <div className="mt-10 mx-auto w-full max-w-300">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <label
              htmlFor="title"
              className="block text-sm/6 font-medium text-BD-CharcoalBlack flex-1/4"
            >
              제목
            </label>
            <div className="mt-2 flex-3/4">
              <input
                type="text"
                name="title"
                id="title"
                value={inputData.title}
                onChange={handleChange}
                required
                className="block w-full rounded-md bg-BD-PureWhite px-3 py-1.5 text-base text-BD-CharcoalBlack outline-1 -outline-offset-1 outline-BD-SoftGrayLine placeholder:text-BD-SoftGrayLine focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold sm:text-sm/6"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="content"
              className="block text-sm/6 font-medium text-BD-CharcoalBlack flex-1/4"
            >
              후기
            </label>
            <div className="mt-2 flex-3/4">
              <textarea
                name="content"
                id="content"
                value={inputData.content}
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
                className="block w-full rounded-md bg-BD-PureWhite px-3 py-1.5 text-base text-BD-CharcoalBlack outline-1 -outline-offset-1 outline-BD-SoftGrayLine placeholder:text-BD-SoftGrayLine focus:outline-2 focus:-outline-offset-2 focus:outline-BD-ElegantGold sm:text-sm/6"
              />
              <div className="flex flex-wrap gap-4 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative w-24">
                    <img
                      src={
                        typeof img === 'string' ? img : URL.createObjectURL(img)
                      }
                      alt={`review-${index}`}
                      className="w-24 h-24 rounded border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-end">
            <Button type="submit" size="lg" variant="positive">
              수정
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleCancel}
            >
              취소
            </Button>
          </div>
        </form>
      </div>

      {showModal && (
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

export default ReviewUpdateForm;