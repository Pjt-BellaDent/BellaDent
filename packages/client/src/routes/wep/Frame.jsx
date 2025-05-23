import React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  width: 100%;
  flex-grow: 1;
`;

function Frame() {
  return (
    <Wrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
}

export default Frame;
