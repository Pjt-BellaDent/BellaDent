import React from 'react';
import { Routes, Route } from 'react-router';
import Frame from './routes/Frame.jsx';
import Home from './components/Home.jsx';
import TreatmentInfo_1 from './components/TreatmentInfo_1.jsx';
import TreatmentInfo_2 from './components/TreatmentInfo_2.jsx';
import TreatmentInfo_3 from './components/TreatmentInfo_3.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Frame />}>
          <Route index element={<Home />} />
          <Route element={<TreatmentInfo_1 />} />
          <Route element={<TreatmentInfo_2 />} />
          <Route element={<TreatmentInfo_3 />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
