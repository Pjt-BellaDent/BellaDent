import { createContext, useState, useContext } from 'react';

const MenuListContext = createContext(null);

export const MenuListProvider = ({ children }) => {
  const [menuList, setMenuList] = useState(() => {
    const savedMenuList = localStorage.getItem('menuList');
    return savedMenuList
      ? JSON.parse(savedMenuList)
      : [
          {
            label: '병원소개',
            code: 'clinic',
            sub: [
              { menu: '인사말 / 병원 철학', link: 'greeting' },
              { menu: '의료진 소개', link: 'doctors' },
              { menu: '내부 둘러보기', link: 'tour' },
              { menu: '오시는 길', link: 'location' },
            ],
          },
          {
            label: '진료 안내',
            code: 'treatments',
            sub: [
              { menu: '진료 과목 안내', link: 'services' },
              { menu: '비급여 진료 과목 안내', link: 'non-covered' },
              { menu: '장비 소개', link: 'equipment' },
            ],
          },
          {
            label: '교정 / 미용 치료',
            code: 'aesthetics',
            sub: [
              { menu: '교정 치료 안내', link: 'orthodontics' },
              { menu: '미백 / 라미네이트', link: 'whitening' },
              { menu: '전후 사진 갤러리', link: 'gallery' },
            ],
          },
          {
            label: '상담 / 예약',
            code: 'booking',
            sub: [
              { menu: '온라인 예약', link: 'reservation' },
              { menu: '실시간 상담', link: 'live-chat' },
            ],
          },
          {
            label: '커뮤니티 / 고객지원',
            code: 'support',
            sub: [
              { menu: '자주 묻는 질문 (FAQ)', link: 'faq' },
              { menu: '공지사항', link: 'clinic-news' },
              { menu: '치료 후기 게시판', link: 'reviews' },
            ],
          },
        ];
  });

  return (
    <MenuListContext.Provider value={{ menuList, setMenuList }}>
      {children}
    </MenuListContext.Provider>
  );
};

export const useMenuList = () => {
  return useContext(MenuListContext);
};
