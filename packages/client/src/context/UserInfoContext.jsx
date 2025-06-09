// import { createContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';

// export const UserInfoContext = createContext(null);
// export const UserInfoProvider = ({ children }) => {
//   const [userInfo, setUserInfo] = useState(undefined);
//   const [isLogin, setIsLogin] = useState(false);
//   const [roleLocation, setRoleLocation] = useState('/');
//   useEffect(() => {
//     const token = Cookies.get('token');
//     try {
//       if (token) {
//         const decoded = jwtDecode(token);
//         setUserInfo(decoded);
//         setRoleLocation(decoded.role === 'patient' ? '/' : '/dashboard');
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }, [isLogin]);
//   return (
//     <UserInfoContext.Provider
//       value={{ userInfo, roleLocation, isLogin, setIsLogin }}
//     >
//       {children}
//     </UserInfoContext.Provider>
//   );
// };

import { createContext, useState } from 'react';

export const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
  // 임시 로그인 상태: 관리자 권한으로 고정
  const [userInfo, setUserInfo] = useState({
    name: '테스트 관리자',
    role: 'admin',
  });
  const [isLogin, setIsLogin] = useState(true);
  const [roleLocation, setRoleLocation] = useState('/dashboard');

  // 실제 토큰 기반 로그인 로직은 나중에 적용 예정
  /*
  import Cookies from 'js-cookie';
  import jwtDecode from 'jwt-decode';
  useEffect(() => {
    const token = Cookies.get('token');
    try {
      if (token) {
        const decoded = jwtDecode(token);
        setUserInfo(decoded);
        setRoleLocation(decoded.role === 'patient' ? '/' : '/dashboard');
        setIsLogin(true);
      } else {
        setUserInfo(null);
        setIsLogin(false);
      }
    } catch (err) {
      console.error(err);
      setUserInfo(null);
      setIsLogin(false);
    }
  }, []);
  */

  return (
    <UserInfoContext.Provider value={{ userInfo, roleLocation, isLogin, setIsLogin }}>
      {children}
    </UserInfoContext.Provider>
  );
};
