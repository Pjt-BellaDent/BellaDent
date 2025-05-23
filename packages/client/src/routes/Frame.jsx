import React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

function Frame() {
  const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
  `;
  const Mein = styled.main`
    width: 100%;
    flex-grow: 1;
  `;

  return (
    <Wrapper>
      <Header />
      <Mein>
        <Outlet />
      </Mein>
      <Footer />
    </Wrapper>
  );
}

export default Frame;