import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserInfoContext } from '../context/UserInfoContext.jsx';
import Cookies from 'js-cookie';
import axios from 'axios';

function UserInfo() {
  const navigate = useNavigate();
  const { userInfo, isLogin, setIsLogin } = useContext(UserInfoContext);

  const handleDelete = async () => {
    try {
      confirm('정말로 회원탈퇴를 진행 하시겠습니까?');
      const url = `http://localhost:3000/users/${userInfo.id}`;
      const response = await axios.delete(url);
      if (response.status === 201) {
        Cookies.remove('token');
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
      <button className="mx-auto w-full cursor-pointer" onClick={handleDelete}>
        회원탈퇴
      </button>
    </>
  );
}

export default UserInfo;
