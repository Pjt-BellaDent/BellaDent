import { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import Cookies from 'js-cookie';
import { UserInfoContext } from '../context/UserInfoContext.jsx';
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

  const { userInfo, isLogin, setIsLogin } = useContext(UserInfoContext);
  const [onMenu, setOnMenu] = useState(null);
  const navRef = useRef();
  const navigate = useNavigate();

  const menuList = [
    {
      label: '병원소개',
      sub: [
        { menu: '인사말 / 병원 철학', link: '/greeting' },
        { menu: '의료진 소개', link: '/doctors' },
        { menu: '내부 둘러보기', link: '/tour' },
        { menu: '오시는 길', link: '/location' },
      ],
    },
    {
      label: '진료 안내',
      sub: [
        { menu: '진료 과목 안내', link: '/services' },
        { menu: '비급여 진료 과목 안내', link: '/non-covered' },
        { menu: '장비 소개', link: '/equipment' },
      ],
    },
    {
      label: '교정 / 미용 치료',
      sub: [
        {
          menu: '교정 치료 안내',
          link: '/orthodontics',
        },
        { menu: '미백 / 라미네이트', link: '/whitening' },
        { menu: '전후 사진 갤러리', link: '/gallery' },
      ],
    },
    {
      label: '상담 / 예약',
      sub: [
        { menu: '온라인 예약', link: '/reservation' },
        { menu: '실시간 상담', link: '/live-chat' },
      ],
    },
    {
      label: '커뮤니티 / 고객지원',
      sub: [
        {
          menu: '자주 묻는 질문 (FAQ)',
          link: '/faq',
        },
        { menu: '공지사항', link: '/clinic-news' },
        { menu: '치료 후기 게시판', link: '/reviews' },
      ],
    },
  ];

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
            {menuList.map((menu, i) => (
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
                      <Link to={sub.link}>{sub.menu}</Link>
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
