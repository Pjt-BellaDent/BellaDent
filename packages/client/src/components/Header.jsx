import React from 'react';
import { Link } from 'react-router';
import styled from '@emotion/styled';

function Header() {
  let Header = styled.header`
    width: 100%;
    height: 80px;
  `;
  let Container = styled.div`
    width: 1440px;
    margin: 0 auto;
  `;
  let ImageBox = styled.div`
    width: 200px;
    height: 80px;
    background-color: #f0f0f0;
  `;
  let SubMenu = styled.ul`
    display: none;
    position: absolute;
    background-color: #fff;
    z-index: 1000;
  `;

  return (
    <Header>
      <Container className="flex justify-between items-center">
        <ImageBox>
          <img src="" alt="logo" />
        </ImageBox>
        <nav className='text-center'>
          <ul className="list flex gap-10">
            <li className="menu">
              <Link>홈</Link>
            </li>
            <li className="menu">
              <Link>병원소개</Link>
              <SubMenu>
                <li className="sub_menu">
                  <Link>인사말 / 병원 철학</Link>
                </li>
                <li className="sub_menu">
                  <Link>의료진 소개</Link>
                </li>
                <li className="sub_menu">
                  <Link>내부 둘러보기</Link>
                </li>
                <li className="sub_menu">
                  <Link>오시는 길</Link>
                </li>
              </SubMenu>
            </li>
            <li className="menu">
              <Link>진료 안내</Link>
              <SubMenu>
                <li className="sub_menu">
                  <Link>진료 과목 안내</Link>
                </li>
                <li className="sub_menu">
                  <Link>비급여 진료 과목 안내</Link>
                </li>
                <li className="sub_menu">
                  <Link>장비 소개</Link>
                </li>
              </SubMenu>
            </li>
            <li className="menu">
              <Link>교정 / 미용 치료</Link>
              <SubMenu>
                <li className="sub_menu">
                  <Link>교정 치료 안내</Link>
                </li>
                <li className="sub_menu">
                  <Link>미백 / 라미네이트</Link>
                </li>
                <li className="sub_menu">
                  <Link>전후 사진 갤러리</Link>
                </li>
              </SubMenu>
            </li>
            <li className="menu">
              <Link>상담 / 예약</Link>
              <SubMenu>
                <li className="sub_menu">
                  <Link>온라인 예약</Link>
                </li>
                <li className="sub_menu">
                  <Link>실시간 상담</Link>
                </li>
              </SubMenu>
            </li>
            <li className="menu">
              <Link>커뮤니티 / 고객지원</Link>
              <SubMenu>
                <li className="sub_menu">
                  <Link>자주묻는 질문 (FAQ)</Link>
                </li>
                <li className="sub_menu">
                  <Link>공지사항</Link>
                </li>
                <li className="sub_menu">
                  <Link>치료 후기 게시판</Link>
                </li>
              </SubMenu>
            </li>
          </ul>
        </nav>
        <div className="login_box">
          <ul className="login_list flex gap-5">
            <li className="login_menu">
              <Link>로그인</Link>
            </li>
            <li className="login_menu">
              <Link>회원가입</Link>
            </li>
          </ul>
        </div>
      </Container>
    </Header>
  );
}

export default Header;
