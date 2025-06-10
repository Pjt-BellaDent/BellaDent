import { createContext, useState, useEffect, useContext } from 'react';

const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(undefined);
  const [userToken, setUserToken] = useState(undefined);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (userInfo !== undefined) {
      setUserInfo(undefined);
    }
    if (userToken !== undefined) {
      setUserToken(undefined);
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
