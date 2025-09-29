import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';

function Frame() {
  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <main className='w-full flex-grow-1 mt-20 relative'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}


export default Frame;
