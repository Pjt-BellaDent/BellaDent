// client/src/hooks/useUserInfo.js
import { useUserInfo } from "../contexts/UserInfoContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAuthGuard = (allowedRoles = []) => {
  const { isLogin, userInfo } = useUserInfo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    } else if (
      allowedRoles.length > 0 &&
      (!userInfo || !allowedRoles.includes(userInfo.role))
    ) {
      navigate("/unauthorized");
    }
  }, [isLogin, userInfo, navigate, allowedRoles]);

  return { isLogin, userInfo };
};

export default useAuthGuard;