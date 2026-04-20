import React, { useState } from 'react';
import { AuthContext, User } from './AuthContext';
import { api } from '../services/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storageUser = localStorage.getItem('user_data');
    const storageToken = localStorage.getItem('access_token');
    if (storageToken && storageUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storageToken}`;
      return JSON.parse(storageUser);
    }
    return null;
  });

  const [loading] = useState(false);

  async function login(token: string, userData: User) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
