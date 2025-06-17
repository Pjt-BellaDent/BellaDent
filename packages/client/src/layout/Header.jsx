import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserInfo } from '../contexts/UserInfoContext.jsx';
import { useMenuList } from '../contexts/MenuListContext.jsx';
import LogoSimple from '../components/web/LogoSimple.jsx';
import Wrapper from '../components/web/Wrapper.jsx';

function Header() {
  const { menuList } = useMenuList();
  const { userInfo, signOutUser } = useUserInfo();
  const [onMenu, setOnMenu] = useState(null);
  const navRef = useRef();
  const submenuRefs = useRef([]);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef();

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

  useEffect(() => {
    const observerTarget = document.getElementById('header-observer');
    if (!observerTarget) return;

    observerRef.current = new window.IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observerRef.current.observe(observerTarget);

    return () => {
      if (observerRef.current && observerTarget) {
        observerRef.current.unobserve(observerTarget);
      }
    };
  }, []);

  const handleLogout = () => {
    signOutUser();
    alert('로그아웃 되었습니다.');
    navigate(0);
  };

  return (
    <>
      <div id="header-observer" style={{ height: 1 }}></div>
      <header
        className={`w-full  grow-0 shrink-0 font-BD-mont  text-lg fixed top-0 left-0 z-5 transition-colors duration-800`}
        style={{
          backgroundColor: scrolled ? '#f8f8f8' : '#333333',
          color: scrolled ? '#333333' : '#c8ab7c',
          boxShadow: scrolled ? '0 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
        }}
      >
        <Wrapper CN="flex justify-between items-center max-w-360 h-20 mx-auto">
          <div>
            <LogoSimple color={scrolled ? '#333333' : '#c8ab7c'} />
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
                      className="flex flex-col absolute top-[120%] left-1/2 -translate-x-1/2 min-w-50 shadow-lg  py-2 transition-all duration-500 gap-2 z-10"
                      style={{
                        maxHeight:
                          onMenu === i && submenuRefs.current[i]
                            ? submenuRefs.current[i].scrollHeight + 'px'
                            : '0',
                        opacity: onMenu === i ? 1 : 0,
                        overflow: 'hidden',
                        pointerEvents: onMenu === i ? 'auto' : 'none',
                        backgroundColor: scrolled ? '#f8f8f8' : '#333333',
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
            </ul>
          </div>
        </Wrapper>
      </header>
    </>
  );
}

export default Header;
