import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUserInfo } from '../contexts/UserInfoContext.jsx';
import { useMenuList } from '../contexts/MenuListContext.jsx';
import logo from '../assets/logo.png';

function Header() {
  const { menuList } = useMenuList();
  const { userInfo, isLogin, setIsLogin } = useUserInfo();
  const [onMenu, setOnMenu] = useState(null);
  const navRef = useRef();
  const submenuRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOnMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    alert('로그아웃 되었습니다.');
    setIsLogin(!isLogin);
    navigate(0);
  };

  return (
    <header className="max-w-full bg-white grow-0 shrink-0">
      <div className="flex justify-between items-center max-w-360 h-20 mx-auto">
        <div>
          <img src={logo} alt="logo" />
        </div>
        <nav className="text-center" ref={navRef}>
          <ul className="list flex gap-10">
            <li className="menu">
              <Link to={'/'}>홈</Link>
            </li>
            {Array.isArray(menuList) &&
              menuList.map((menu, i) => (
                <li
                  key={i}
                  className="menu cursor-pointer relative"
                  onClick={() => setOnMenu(onMenu === i ? null : i)}
                >
                  <p>{menu.label}</p>
                  <ul
                    ref={(el) => (submenuRefs.current[i] = el)}
                    className="flex flex-col absolute left-1/2 -translate-x-1/2 min-w-50 bg-white shadow-lg  py-2 transition-all duration-800 gap-2 z-10"
                    style={{
                      maxHeight:
                        onMenu === i && submenuRefs.current[i]
                          ? submenuRefs.current[i].scrollHeight + 'px'
                          : '0',
                      opacity: onMenu === i ? 1 : 0,
                      overflow: 'hidden',
                      pointerEvents: onMenu === i ? 'auto' : 'none',
                    }}
                  >
                    {menu.sub.map((sub, i) => (
                      <li
                        className="sub_menu"
                        key={i}
                        onClick={() => setOnMenu(null)}
                      >
                        <Link to={`/${sub.link}`}>{sub.menu}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </nav>
        <div>
          <ul className="flex gap-5">
            {userInfo ? (
              <>
                <li>
                  <Link to={'/userinfo'}>회원정보</Link>
                </li>
                <li>
                  <button className="cursor-pointer" onClick={handleLogout}>
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={'/signin'}>로그인</Link>
                </li>
                <li>
                  <Link to={'/signup'}>회원가입</Link>
                </li>
              </>
            )}
            <li className="login_menu">
              <Link to={'/Dashboard'}>대시보드</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
