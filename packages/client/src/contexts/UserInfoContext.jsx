import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';

const UserInfoContext = createContext({
  userInfo: null,
  userToken: null,
  isLogin: false,
  signOutUser: async () => {},
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

  const auth = getAuth();

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (user) {
        try {
          const idToken = await user.getIdToken();
          const serverUserInfo = await fetchServerUserInfo(idToken);
          setUserInfo(serverUserInfo);
          setUserToken(idToken);
          setIsLogin(true);
        } catch (tokenOrFetchError) {
          console.error(
            'Error during onAuthStateChanged token/fetch:',
            tokenOrFetchError
          );
          setUserInfo(null);
          setUserToken(null);
          setIsLogin(false);
        }
      } else {
        setUserInfo(null);
        setUserToken(null);
        setIsLogin(false);
      }

    });

    return () => {
      unsubscribe();
    };

  }, []);

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
