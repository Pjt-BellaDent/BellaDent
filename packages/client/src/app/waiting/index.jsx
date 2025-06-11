// src/app/waiting/index.jsx
import React from "react";
import WaitingManager from "./components/WaitingManager";

const WaitingPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <WaitingManager />
    </div>
  );
};

export default WaitingPage;
