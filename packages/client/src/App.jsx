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
import Faq from './routes/web/nev/support/Faq';
import ClinicNews from './routes/web/nev/support/ClinicNews';
import Reviews from './routes/web/nev/support/Reviews';

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
