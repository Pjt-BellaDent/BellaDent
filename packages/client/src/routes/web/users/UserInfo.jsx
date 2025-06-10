import react from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../../contexts/UserInfoContext.jsx';
import axios from 'axios';

function UserInfo() {
  const navigate = useNavigate();
  const { userInfo, userToken, isLogin, setIsLogin } = useUserInfo;

  const handleDisabled = async () => {
    try {
      confirm('정말로 회원탈퇴를 진행 하시겠습니까?');
      const url = `http://localhost:3000/users/disabled/${userInfo.id}`;
      const response = await axios.put(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        withCredentials: true,
      });
      if (response.status === 201) {
        alert('회원탈퇴가 완료되었습니다.');
        setIsLogin(!isLogin);
        navigate(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button className="mx-auto w-full">
        <Link to={'/user-update'}>회원정보수정</Link>
      </button>
      <button className="mx-auto w-full cursor-pointer" onClick={handleDisabled}>
        회원탈퇴
      </button>
    </>
  );
}

export default UserInfo;
