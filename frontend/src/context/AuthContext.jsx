import { createContext, useState, useEffect } from 'react';
import { addStudyTime } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in on refresh
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // 🕒 Global Timer Logic: Runs while user is logged in
  useEffect(() => {
    let interval;
    if (user) {
      // Add 1 minute of study time (1/60 hours) every 60 seconds
      interval = setInterval(() => {
        addStudyTime(1 / 60).catch(err => console.error("Timer update failed:", err));
      }, 60000); // 60 seconds
    }

    return () => {
      // Stop tracking if logged out or unmounted
      if (interval) clearInterval(interval);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};