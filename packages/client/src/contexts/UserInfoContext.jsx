import { createContext, useState, useEffect, useContext } from 'react';

const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
  // localStorage에서 초기값 불러오기
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : undefined;
  });
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('userToken') || undefined;
  });
  const [isLogin, setIsLogin] = useState(() => {
    return !!localStorage.getItem('userToken');
  });

  // userInfo, userToken이 바뀔 때마다 localStorage에 저장
  useEffect(() => {
    if (userInfo !== undefined) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  useEffect(() => {
    if (userToken !== undefined) {
      localStorage.setItem('userToken', userToken);
    } else {
      localStorage.removeItem('userToken');
    }
  }, [userToken]);

  // 로그아웃 시 상태 초기화
  useEffect(() => {
    if (!isLogin) {
      setUserInfo(undefined);
      setUserToken(undefined);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
    }
  }, [isLogin]);

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        isLogin,
        userToken,
        setIsLogin,
        setUserToken,
        setUserInfo,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  return useContext(UserInfoContext);
};
