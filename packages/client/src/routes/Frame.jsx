import React from 'react';
import styled from '@emotion/styled';
import { Outlet } from 'react-router';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Sidebar from '../components/Sidebar';

function Frame() {
  const Wrapper = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
  `;
  const Mein = styled.main`
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '30px', background: '#f4f7fc' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Frame;
