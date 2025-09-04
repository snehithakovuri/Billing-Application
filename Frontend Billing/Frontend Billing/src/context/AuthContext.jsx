import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  const SESSION_TIMEOUT = 5 * 60 * 60 * 1000; 

useEffect(() => {
  let timer;

  const resetTimer = () => {
    clearTimeout(timer);
    if (user) {
timer = setTimeout(() => {
  console.log("Session expired - redirecting");
  logout();
  navigate("/session-timeout");
}, SESSION_TIMEOUT);

    }
  };

  // List of user activity events
  const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

  // Attach event listeners
  events.forEach((event) => window.addEventListener(event, resetTimer));

  // Initialize the timer
  resetTimer();

  return () => {
    clearTimeout(timer);
    events.forEach((event) =>
      window.removeEventListener(event, resetTimer)
    );
  };
}, [user, navigate]);


  const login = (data) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
