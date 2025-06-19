import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../contexts/UserInfoContext.jsx';
import axios from 'axios';
import Modal from '../web/Modal.jsx';
import Title from '../web/Title.jsx';

function ChatForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ question: '' });
  const [messages, setMessages] = useState([]);
  const { userInfo, userToken } = useUserInfo();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [aiReply, setAiReply] = useState(false);
  const [isAiActive, setIsAiActive] = useState(true);

  useEffect(() => {
    if (!userInfo) return;
    const fetchMessages = async () => {
      try {
        const url = `http://localhost:3000/consultations/${userInfo.id}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          withCredentials: true,
        });
        setMessages(response.data.messages || []);
      } catch (error) {
        if (error.status !== 404) {
          console.error('Error fetching initial messages:', error);
        }
      }
    };
    fetchMessages();
  }, [userInfo, userToken, aiReply]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim()) return;

    if (!userInfo) {
      setModalMessage('로그인 후 이용 가능합니다.');
      setShowModal(true);
      return;
    }

    try {
      const url = 'http://localhost:3000/consultations';
      const saveRes = await axios.post(
        url,
        { question: formData.question },
        {
          headers: { Authorization: `Bearer ${userToken}` },
          withCredentials: true,
        }
      );

      if (isAiActive) {
        const aiUrl = 'http://localhost:3000/consultations/ai';
        const aiRes = await axios.post(
          aiUrl,
          { question: formData.question },
          {
            headers: { Authorization: `Bearer ${userToken}` },
            withCredentials: true,
          }
        );

        setAiReply(!aiReply);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-2xl mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">💬 AI 챗봇 상담</h2>
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] text-sm px-4 py-2 rounded-lg whitespace-pre-wrap ${
                msg.senderType === 'patient'
                  ? 'ml-auto bg-blue-100 text-right'
                  : 'mr-auto bg-gray-100 text-left'
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-6 py-2 rounded outline-1 -outline-offset-1 hover:-outline-offset-2 bg-BD-WarmBeige outline-BD-CoolGray hover:outline-BD-CharcoalBlack focus:outline-BD-CharcoalBlack duration-300"
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="질문을 입력하세요..."
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2 rounded bg-BD-ElegantGold text-BD-CharcoalBlack hover:bg-BD-CharcoalBlack hover:text-BD-PureWhite duration-300"
          >
            전송
          </button>
        </div>
      </div>

      <Modal
        show={showModal}
        setShow={setShowModal}
        activeClick={() => {
          setShowModal(false);
          navigate('/signin');
        }}
      >
        <Title>{modalMessage}</Title>
      </Modal>
    </>
  );
}

export default ChatForm;
