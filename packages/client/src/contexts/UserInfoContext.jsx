// src/contexts/UserInfoContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import axiosInstance from '../libs/axiosInstance';

const UserInfoContext = createContext({
  userInfo: null,
  userToken: null,
  isLogin: false,
  loading: true,
  signOutUser: async () => {},
});

const fetchServerUserInfo = async () => {
  try {
    const res = await axiosInstance.post('/users/signIn');
    return res.data.userInfo;
  } catch (fetchError) {
    console.error('Error fetching initial user info from server:', fetchError);
    throw fetchError;
  }
};

export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userToken, setUserToken] = useState(
    () => localStorage.getItem('userToken') || null
  );
  const [isLogin, setIsLogin] = useState(!!userToken);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          localStorage.setItem('userToken', idToken);
          setUserToken(idToken);
          axiosInstance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${idToken}`;

          const serverUserInfo = await fetchServerUserInfo();
          setUserInfo(serverUserInfo);
          setIsLogin(true);
        } catch (error) {
          console.error('Failed to fetch user info after auth change:', error);
          setUserInfo(null);
          setIsLogin(false);
          localStorage.removeItem('userToken');
          delete axiosInstance.defaults.headers.common['Authorization'];
        } finally {
          setLoading(false);
        }
      } else {
        localStorage.removeItem('userToken');
        setUserToken(null);
        setUserInfo(null);
        setIsLogin(false);
        delete axiosInstance.defaults.headers.common['Authorization'];
        setLoading(false);
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
        loading,
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
