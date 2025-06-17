import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';

const UserInfoContext = createContext({
  userInfo: null,
  userToken: null,
  isLogin: false,
  isLoading: true, // ✨ 로딩 상태 추가 ✨
  signOutUser: async () => {}, // 로그아웃 함수 추가
});

const fetchServerUserInfo = async (idToken) => {
  const url = 'http://localhost:3000/users/signIn';
  try {
    const res = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        withCredentials: true,
      }
    );
    return res.data.userInfo;
  } catch (fetchError) {
    console.error(
      'Error fetching additional user info from server:',
      fetchError
    );
    throw fetchError;
  }
};

export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✨ 로딩 상태 초기값 true ✨

  const auth = getAuth(); // Firebase Auth 인스턴스 가져오기

  // Firebase 인증 상태 변화 리스너 설정
  useEffect(() => {

    // ✨✨✨ onAuthStateChanged 리스너 설정 (unsubscribe 함수를 변수에 저장) ✨✨✨
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {
        // 사용자가 로그인 상태인 경우 (새로고침 시 세션 복원 포함)
        try {
          const idToken = await user.getIdToken(); // 서버 검증을 위한 ID 토큰 가져오기
          // ✨ 분리한 함수를 사용하여 서버로부터 추가 정보를 가져옴 ✨
          const serverUserInfo = await fetchServerUserInfo(idToken);
          setUserInfo(serverUserInfo);
          setUserToken(idToken);
          setIsLogin(true);
        } catch (tokenOrFetchError) {
          // 토큰 가져오기 또는 서버 정보 가져오기 실패 시 처리
          console.error(
            'Error during onAuthStateChanged token/fetch:',
            tokenOrFetchError
          );
          // 오류 발생 시 사용자 정보를 초기화하여 로그아웃 상태로 만듭니다.
          setUserInfo(null);
          setUserToken(null);
          setIsLogin(false);
        }
      } else {
        // 사용자가 로그아웃 상태인 경우 (signOut 호출 후 또는 세션 만료 등)
        setUserInfo(null);
        setUserToken(null);
        setIsLogin(false);
      }

      setIsLoading(false);
    });

    // 컴포넌트가 언마운트될 때 onAuthStateChanged 리스너를 해제합니다.
    return () => {
      console.log('Cleaning up onAuthStateChanged listener.');
      unsubscribe();
    };

  }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log('Successfully signed out from Firebase Auth.');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        isLogin,
        userToken,
        setIsLogin,
        setUserToken,
        setUserInfo,
        signOutUser,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};
