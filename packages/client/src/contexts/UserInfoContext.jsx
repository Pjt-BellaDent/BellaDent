import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import axiosInstance from '../libs/axiosInstance';

const UserInfoContext = createContext({
  userInfo: null,
  userToken: null,
  isLogin: false,
  signOutUser: async () => {},
});

const fetchServerUserInfo = async () => {
  try {
    const res = await axiosInstance.post('/users/signIn');
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
  const [userToken, setUserToken] = useState(
    () => localStorage.getItem('userToken') || null
  );
  const [isLogin, setIsLogin] = useState(!!userToken);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        localStorage.setItem('userToken', idToken);
        setUserToken(idToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        
        try {
          const serverUserInfo = await fetchServerUserInfo();
          setUserInfo(serverUserInfo);
          setIsLogin(true);
        } catch (error) {
          console.error('Failed to fetch server user info after auth change:', error);
          setUserInfo(null);
          setIsLogin(false);
        }
      } else {
        localStorage.removeItem('userToken');
        setUserToken(null);
        setUserInfo(null);
        setIsLogin(false);
        delete axiosInstance.defaults.headers.common['Authorization'];
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        isLogin,
        userToken,
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
