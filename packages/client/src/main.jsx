import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HospitalProvider } from './contexts/HospitalContext.jsx';
import { MenuListProvider } from './contexts/MenuListContext.jsx';
import { UserInfoProvider } from './contexts/UserInfoContext.jsx';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <HospitalProvider>
    <MenuListProvider>
      <UserInfoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserInfoProvider>
    </MenuListProvider>
  </HospitalProvider>
);
