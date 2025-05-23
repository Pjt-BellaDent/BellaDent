import { Routes, Route } from 'react-router-dom';
import Frame from './routes/wep/Frame';
import Home from './routes/wep/Home';
import SignIn from './routes/wep/users/SignIn';
import SignUp from './routes/wep/users/SignUp';
import UserInfo from './routes/wep/users/UserInfo';
import UserUpdate from './routes/wep/users/UserUpdate';

import Greeting from './routes/wep/nev/clinic/Greeting';
import Doctors from './routes/wep/nev/clinic/Doctors';
import Tour from './routes/wep/nev/clinic/Tour';
import Location from './routes/wep/nev/clinic/Location';
import Services from './routes/wep/nev/treatments/Services';
import NonCovered from './routes/wep/nev/treatments/NonCovered';
import Equipment from './routes/wep/nev/treatments/Equipment';
import Orthodontics from './routes/wep/nev/aesthetics/Orthodontics';
import Whitening from './routes/wep/nev/aesthetics/Whitening';
import Gallery from './routes/wep/nev/aesthetics/Gallery';
import Reservation from './routes/wep/nev/booking/Reservation';
import LiveChat from './routes/wep/nev/booking/LiveChat';
import Faq from './routes/wep/nev/support/Faq';
import ClinicNews from './routes/wep/nev/support/ClinicNews';
import Reviews from './routes/wep/nev/support/Reviews';

import DashboardFrame from './routes/DashboardFrame';
import Dashboard from './components/Dashboard';
import Notice from './components/Notice';
import WaitingStatus from './components/WaitingStatus/WaitingStatus';
import StaffSchedule from './components/StaffSchedule/StaffSchedule';
import PatientList from './components/PatientList/PatientList';
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

            <Route path="SignIn" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="userinfo" element={<UserInfo />} />
            <Route path="user-update" element={<UserUpdate />} />

            <Route path="greeting" element={<Greeting />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="tour" element={<Tour />} />
            <Route path="location" element={<Location />} />
            <Route path="services" element={<Services />} />
            <Route path="non-covered" element={<NonCovered />} />
            <Route path="equipment" element={<Equipment />} />
            <Route path="orthodontics" element={<Orthodontics />} />
            <Route path="whitening" element={<Whitening />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="reservation" element={<Reservation />} />
            <Route path="live-chat" element={<LiveChat />} />
            <Route path="faq" element={<Faq />} />
            <Route path="clinic-news" element={<ClinicNews />} />
            <Route path="reviews" element={<Reviews />} />
          </Route>

          <Route path="/Dashboard" element={<DashboardFrame />}>
            <Route index element={<Dashboard />} />

            <Route path="notice" element={<Notice />} />
            <Route path="waiting" element={<WaitingStatus />} />
            <Route path="schedule" element={<StaffSchedule />} />
            <Route path="patients" element={<PatientList />} />
            <Route
              path="reservations"
              element={<ReservationManager />}
            />
            <Route path="chat" element={<Chat />} />
            <Route
              path="chat-settings"
              element={<ChatbotSettings />}
            />
            <Route path="settings" element={<GeneralSettings />} />
          </Route>
        </Routes>
      </HospitalProvider>
    </>
  );
}

export default App;
