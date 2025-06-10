import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Frame from './routes/web/Frame';

import Home from './routes/web/Home';
import SignIn from './routes/web/users/SignIn';
import SignUp from './routes/web/users/SignUp';
import UserInfo from './routes/web/users/UserInfo';
import UserUpdate from './routes/web/users/UserUpdate';
import Greeting from './routes/web/nev/clinic/Greeting';
import Doctors from './routes/web/nev/clinic/Doctors';
import Tour from './routes/web/nev/clinic/Tour';
import Location from './routes/web/nev/clinic/Location';
import Services from './routes/web/nev/treatments/Services';
import NonCovered from './routes/web/nev/treatments/NonCovered';
import Orthodontics from './routes/web/nev/aesthetics/Orthodontics';
import Equipment from './routes/web/nev/treatments/Equipment';
import Whitening from './routes/web/nev/aesthetics/Whitening';
import Gallery from './routes/web/nev/aesthetics/Gallery';
import Reservation from './routes/web/nev/booking/Reservation';
import LiveChat from './routes/web/nev/booking/LiveChat';
import ClinicNews from './routes/web/nev/support/ClinicNews';
import Faq from './routes/web/nev/support/Faq';
import Reviews from './routes/web/nev/support/Reviews';

import DashboardFrame from './routes/DashboardFrame';

import Dashboard from './components/Dashboard';
import NoticeModal from './components/Notice/NoticeModal';
import WaitingStatus from './components/WaitingStatus/WaitingStatus';
import WaitingManager from './components/WaitingStatus/WaitingManager';
import StaffSchedule from './components/StaffSchedule/StaffSchedule';
import PatientList from './components/PatientList/PatientList';
import ReservationManager from './components/ReservationManager/ReservationManager';
import Chat from './components/Chat';
import ChatbotSettings from './components/ChatbotSettings';
import GeneralSettings from './components/GeneralSettings/GeneralSettings';
import Sms from './components/Sms/SmsBroadcast';
import Feedback from './components/Feedback/FeedbackList';
import UserPermission from './components/GeneralSettings/UserPermission.jsx';
import HospitalInfo from './components/GeneralSettings/HospitalInfo.jsx';
import Register from './components/OnsiteRegister.jsx';

import NotFound from './components/NotFound';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Frame />}>
          <Route index element={<Home />} />
          <Route path="signIn" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="userinfo" element={<UserInfo />} />

          <Route path="user-update" element={<UserUpdate />} />
          <Route path="greeting" element={<Greeting />} />
          <Route path="tour" element={<Tour />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="location" element={<Location />} />
          <Route path="services" element={<Services />} />
          <Route path="non-covered" element={<NonCovered />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="orthodontics" element={<Orthodontics />} />
          <Route path="whitening" element={<Whitening />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="live-chat" element={<LiveChat />} />
          <Route path="clinic-news" element={<ClinicNews />} />
          <Route path="faq" element={<Faq />} />
          <Route path="reviews" element={<Reviews />} />
        </Route>

        {/* 관리자/스태프/매니저 전용 대시보드 프레임 */}
        <Route path="/Dashboard" element={<DashboardFrame />}>
          <Route index element={<Dashboard />} />
          {/* 공지/게시판(매니저, 관리자) */}
          <Route path="notice" element={<NoticeModal />} />
          {/* 대기현황(스태프, 관리자) */}
          <Route path="waiting-manage" element={<WaitingManager />} />
          <Route path="waiting-status" element={<WaitingStatus />} />
          {/* 예약관리(스태프, 매니저, 관리자) */}
          <Route path="reservations" element={<ReservationManager />} />
          {/* 직원일정(스태프, 관리자) */}
          <Route path="schedule" element={<StaffSchedule />} />
          {/* 환자관리(스태프, 관리자) */}
          <Route path="patients" element={<PatientList />} />
          {/* 문자발송(스태프, 관리자) */}
          <Route path="sms" element={<Sms />} />
          {/* 후기(매니저, 관리자) */}
          <Route path="feedback" element={<Feedback />} />
          {/* 챗봇설정, 채팅(관리자) */}
          <Route path="chat" element={<Chat />} />
          <Route path="chat-settings" element={<ChatbotSettings />} />
          {/* 시스템 설정(관리자) */}
          <Route path="settings" element={<GeneralSettings />} />
          <Route path="user-permissions" element={<UserPermission />} />
          <Route path="hospital-info" element={<HospitalInfo />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
