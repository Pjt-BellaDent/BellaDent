import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserInfoProvider } from './context/UserInfoContext.jsx';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <UserInfoProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserInfoProvider>
);
