import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 웹 전용 프레임 및 라우트
import Frame from './routes/web/Frame';
import Home from './routes/web/Home';
import SignIn from './routes/web/users/SignIn';
import SignUp from './routes/web/users/SignUp';
import UserInfo from './routes/web/users/UserInfo';
import UserUpdate from './routes/web/users/UserUpdate';

// 소개 / 클리닉
import Greeting from './routes/web/nev/clinic/Greeting';
import Doctors from './routes/web/nev/clinic/Doctors';
import Tour from './routes/web/nev/clinic/Tour';
import Location from './routes/web/nev/clinic/Location';

// 진료
import Services from './routes/web/nev/treatments/Services';
import NonCovered from './routes/web/nev/treatments/NonCovered';
import Equipment from './routes/web/nev/treatments/Equipment';

// 심미
import Orthodontics from './routes/web/nev/aesthetics/Orthodontics';
import Whitening from './routes/web/nev/aesthetics/Whitening';
import Gallery from './routes/web/nev/aesthetics/Gallery';

// 예약 및 상담
import Reservation from './routes/web/nev/booking/Reservation';
import LiveChat from './routes/web/nev/booking/LiveChat';

// 고객지원
import ClinicNews from './routes/web/nev/support/ClinicNews';
import Faq from './routes/web/nev/support/Faq';
import Reviews from './routes/web/nev/support/Reviews';

// 관리자 대시보드 프레임
import DashboardFrame from './routes/DashboardFrame';

// 대시보드 기능별 페이지 (components/app)
import Dashboard from './components/app/dashboard/DashboardPage';
import Patients from './components/app/patients/PatientPage';
import Reservations from './components/app/reservations/ReservationsPage';
import Waiting from './components/app/waiting/WaitingPage';
import Sms from './components/app/sms/SmsPage';
import StaffSchedule from './components/app/StaffSchedule/StaffSchedule';
import Settings from './components/app/settings/GeneralSettings';
import Chatbot from './components/app/chatbot/Chat';
import ChatbotSettings from './components/app/chatbot/Settings';
import ReviewsManager from './components/app/reviews/reviews-manager';

// 공통
import NotFound from './components/NotFound';

function App() {
  return (
    <Routes>
      {/* 사용자용 웹 프레임 */}
      <Route path="/" element={<Frame />}>
        <Route index element={<Home />} />
        <Route path="signIn" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="userinfo" element={<UserInfo />} />
        <Route path="user-update" element={<UserUpdate />} />

        {/* 소개 */}
        <Route path="greeting" element={<Greeting />} />
        <Route path="tour" element={<Tour />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="location" element={<Location />} />

        {/* 진료 */}
        <Route path="services" element={<Services />} />
        <Route path="non-covered" element={<NonCovered />} />
        <Route path="equipment" element={<Equipment />} />

        {/* 심미 */}
        <Route path="orthodontics" element={<Orthodontics />} />
        <Route path="whitening" element={<Whitening />} />
        <Route path="gallery" element={<Gallery />} />

        {/* 예약/상담 */}
        <Route path="reservation" element={<Reservation />} />
        <Route path="live-chat" element={<LiveChat />} />

        {/* 고객지원 */}
        <Route path="clinic-news" element={<ClinicNews />} />
        <Route path="faq" element={<Faq />} />
        <Route path="reviews" element={<Reviews />} />
      </Route>

      {/* 관리자/스태프 대시보드 프레임 */}
      <Route path="/Dashboard" element={<DashboardFrame />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="waiting-manage" element={<Waiting />} />
        <Route path="sms" element={<Sms />} />
        <Route path="schedule" element={<StaffSchedule />} />
        <Route path="settings" element={<Settings />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="chatbot-settings" element={<ChatbotSettings />} />
        <Route path="reviews-manager" element={<ReviewsManager />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
