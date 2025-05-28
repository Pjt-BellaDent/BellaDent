import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Cookies from 'js-cookie';
import { useUserInfo } from '../contexts/UserInfoContext.jsx';
import { useMenuList } from '../contexts/MenuListContext.jsx';
import logo from '../assets/logo.png';

function Header() {
  const Header = styled.header`
    width: 100%;
    height: 80px;
    flex-grow: 0;
    flex-shrink: 0;
  `;
  const Container = styled.div`
    width: 1440px;
    margin: 0 auto;
  `;
  const ImageBox = styled.div`
    width: 200px;
    height: 80px;
    background-color: #f0f0f0;
  `;
  const SubMenu = styled.ul`
    display: ${({ visible }) => (visible ? 'flex' : 'none')};
    left: 50%;
    flex-direction: column;
    gap: 10px;
    position: absolute;
    transform: translateX(-50%);
    background-color: #fff;
    z-index: 1;
    transition: all 0.5s ease;
    min-width: 200px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 10px 0;
  `;

  const { menuList } = useMenuList();
  const { userInfo, isLogin, setIsLogin } = useUserInfo();
  const [onMenu, setOnMenu] = useState(null);
  const navRef = useRef();
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
    <Header>
      <Container className="flex justify-between items-center">
        <ImageBox>
          <img src={logo} alt="logo" />
        </ImageBox>
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
                  <SubMenu visible={onMenu === i}>
                    {menu.sub.map((sub, i) => (
                      <li
                        className="sub_menu"
                        key={i}
                        onClick={() => setOnMenu(null)}
                      >
                        <Link to={`/${sub.link}`}>{sub.menu}</Link>
                      </li>
                    ))}
                  </SubMenu>
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
      </Container>
    </Header>
  );
}

export default Header;
