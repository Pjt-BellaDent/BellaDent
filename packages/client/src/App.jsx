import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Frame from './routes/Frame';

import Dashboard from './components/Dashboard';
import Notice from './components/Notice';
import WaitingStatus from './components/WaitingStatus/WaitingStatus';
import StaffSchedule from './components/StaffSchedule/StaffSchedule';
import PatientList from './components/PatientList/PatientList';  // ✅ 수정
import ReservationManager from './components/ReservationManager/ReservationManager';
import Chat from './components/Chat';
import ChatbotSettings from './components/ChatbotSettings';
import GeneralSettings from './components/GeneralSettings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Frame />}>
        <Route index element={<Dashboard />} />
        <Route path="notice" element={<Notice />} />
        <Route path="waiting" element={<WaitingStatus />} />
        <Route path="schedule" element={<StaffSchedule />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="reservations" element={<ReservationManager />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat-settings" element={<ChatbotSettings />} />
        <Route path="settings" element={<GeneralSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
