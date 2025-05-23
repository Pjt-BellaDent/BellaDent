import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const UserInfoContext = createContext(null);
export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(undefined);
  const [isLogin, setIsLogin] = useState(false);
  const [roleLocation, setRoleLocation] = useState('/');
  useEffect(() => {
    const token = Cookies.get('token');
    try {
      if (token) {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
        setRoleLocation(decoded.role === 'patient' ? '/' : '/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  }, [isLogin]);
  return (
    <UserInfoContext.Provider
      value={{ userInfo, roleLocation, isLogin, setIsLogin }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};
