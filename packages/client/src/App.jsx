import React from 'react';
import { Routes, Route } from 'react-router';
import Frame from './routes/Frame.jsx';
import Home from './routes/Home.jsx';
import Greeting from './routes/Greeting.jsx';
import Doctor from './routes/Doctor.jsx';
import Inside from './routes/Inside.jsx';
import Location from './routes/Location.jsx';
import Treatment from './routes/Treatment.jsx';
import NonInsurance from './routes/NonInsurance.jsx';
import Equipment from './routes/Equipment.jsx';
import Orthodontic from './routes/Orthodontic.jsx';
import TeethWhitening from './routes/TeethWhitening.jsx';
import Gallery from './routes/Gallery.jsx';
import Reservation from './routes/Reservation.jsx';
import Consultation from './routes/Consultation.jsx';
import Faq from './routes/Faq.jsx';
import Announcement from './routes/Announcement.jsx';
import Review from './routes/Review.jsx';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';

import DashboardFrame from './routes/DashboardFrame.jsx';
import Dashboard from './components/Dashboard';
import Notice from './components/Notice';
import WaitingStatus from './components/WaitingStatus/WaitingStatus';
import StaffSchedule from './components/StaffSchedule/StaffSchedule';
import PatientList from './components/PatientList/PatientList'; // ✅ 수정
import ReservationManager from './components/ReservationManager/ReservationManager';
import Chat from './components/Chat';
import ChatbotSettings from './components/ChatbotSettings';
import GeneralSettings from './components/GeneralSettings';
import { HospitalProvider } from './contexts/HospitalContext.jsx';

function App() {
  return (
    <>
    <HospitalProvider>
      <Routes>
        <Route path="/" element={<Frame />}>
          <Route index element={<Home />} />
          <Route path="/greeting" element={<Greeting />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/inside" element={<Inside />} />
          <Route path="/location" element={<Location />} />
          <Route path="/treatment" element={<Treatment />} />
          <Route path="/non-insurance" element={<NonInsurance />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/orthodontic" element={<Orthodontic />} />
          <Route path="/teeth-whitening" element={<TeethWhitening />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/Announcement" element={<Announcement />} />
          <Route path="/review" element={<Review />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route path="/Dashboard" element={<DashboardFrame />}>
          <Route index element={<Dashboard />} />
          <Route path="/Dashboard/notice" element={<Notice />} />
          <Route path="/Dashboard/waiting" element={<WaitingStatus />} />
          <Route path="/Dashboard/schedule" element={<StaffSchedule />} />
          <Route path="/Dashboard/patients" element={<PatientList />} />
          <Route path="/Dashboard/reservations" element={<ReservationManager />} />
          <Route path="/Dashboard/chat" element={<Chat />} />
          <Route path="/Dashboard/chat-settings" element={<ChatbotSettings />} />
          <Route path="/Dashboard/settings" element={<GeneralSettings />} />
        </Route>
      </Routes>
    </HospitalProvider>
    </>
  );
}

export default App;
