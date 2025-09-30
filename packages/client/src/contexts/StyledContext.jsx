// src/contexts/StyledContext.jsx
import { createContext, useState, useContext } from 'react';

const StyledContext = createContext(null);

export const styledProvider = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  return (
    <styledProvider.Provider
      value={{
        scrolled,
        setScrolled,
      }}
    >
      {children}
    </styledProvider.Provider>
  );
};

export const useStyled = () => {
  return useContext(StyledContext);
};
