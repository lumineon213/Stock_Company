"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  nickname: string;
  balance: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 브라우저 새로고침 시 로컬스토리지에서 로그인 정보 복구
  useEffect(() => {
    const savedUser = localStorage.getItem('agent_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('agent_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agent_user');
    window.location.href = '/'; // 로그아웃 시 메인으로 이동
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};