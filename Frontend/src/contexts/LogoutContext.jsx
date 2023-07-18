import { createContext, useContext, useState } from "react";

const LogoutMessageContext = createContext();

export function useLogoutMessage() {
  return useContext(LogoutMessageContext);
}

export function LogoutMessageProvider({ children }) {
  const [logoutMessage, setLogoutMessage] = useState("");

  const showLogoutMessage = (message) => {
    setLogoutMessage(message);
  };

  const clearLogoutMessage = () => {
    setLogoutMessage("");
  };

  const value = {
    logoutMessage,
    showLogoutMessage,
    clearLogoutMessage,
  };

  return (
    <LogoutMessageContext.Provider value={value}>
      {children}
    </LogoutMessageContext.Provider>
  );
}
