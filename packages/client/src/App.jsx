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
import Notice from './routes/Notice.jsx';
import Review from './routes/Review.jsx';
import SignIn from './components/SignIn.jsx';
import SignUp from './components/SignUp.jsx';

function App() {
  return (
    <>
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
          <Route path="/notice" element={<Notice />} />
          <Route path="/review" element={<Review />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
