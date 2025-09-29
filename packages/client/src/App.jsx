// src/App.jsx
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
import Equipment from './routes/web/nev/treatments/Equipment';

import Orthodontics from './routes/web/nev/aesthetics/Orthodontics';
import Whitening from './routes/web/nev/aesthetics/Whitening';
import Gallery from './routes/web/nev/aesthetics/Gallery';

import Reservation from './routes/web/nev/booking/Reservation';
import LiveChat from './routes/web/nev/booking/LiveChat';

import ClinicNews from './routes/web/nev/support/ClinicNews';
import Faq from './routes/web/nev/support/Faq';
import Reviews from './routes/web/nev/support/Reviews';

import DashboardFrame from './routes/DashboardFrame';

import Dashboard from './components/app/dashboard/DashboardPage';
import Patients from './components/app/patients/PatientPage';
import Reservations from './components/app/reservations/ReservationsPage';
import ReservationList from './components/app/reservations/ReservationList';
import Waiting from './components/app/waiting/WaitingPage';
import Sms from './components/app/sms/SmsPage';
import StaffSchedule from './components/app/StaffSchedule/StaffSchedule';
import Settings from './components/app/settings/GeneralSettings';
import Chatbot from './components/app/chatbot/Chat';
import ChatbotSettings from './components/app/chatbot/Settings';
import ReviewsManager from './components/app/reviews/reviews-manager';
import WaitingStatus from './components/app/waiting/WaitingStatus';
import HospitalInfo from './components/app/settings/HospitalInfo';
import UserPermission from './components/app/settings/UserPermission';
import OnsiteRegister from './components/OnsiteRegister';

import NotFound from './components/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Frame />}>
        <Route index element={<Home />} />
        <Route path="login" element={<SignIn />} />
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

      <Route path="/Dashboard" element={<DashboardFrame />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="reservations" element={<Reservations />}>
          <Route path="list" element={null} />
        </Route>
        <Route path="waiting-manage" element={<Waiting />} />
        <Route path="sms" element={<Sms />} />
        <Route path="schedule" element={<StaffSchedule />} />
        <Route path="settings" element={<Settings />} />
        <Route path="hospital-info" element={<HospitalInfo />} />
        <Route path="user-permissions" element={<UserPermission />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="chatbot-settings" element={<ChatbotSettings />} />
        <Route path="reviews-manager" element={<ReviewsManager />} />
        <Route path="onsite-register" element={<OnsiteRegister />} />
      </Route>

      <Route
        path="/Dashboard/reservations-list"
        element={<ReservationList />}
      />

      <Route path="/waiting-status" element={<WaitingStatus />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
