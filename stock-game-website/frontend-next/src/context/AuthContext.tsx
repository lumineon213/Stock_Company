"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/lib/supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// 관리자 계정 (임시)
const ADMIN_CREDENTIALS = {
  id: 'admin',
  password: '1234',
};

interface UserProfile {
  id: string;
  email: string;
  nickname: string | null;
  balance: number;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 사용자 프로필 가져오기
  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('nickname, balance')
        .eq('user_id', authUser.id)
        .single();

      if (error) {
        console.warn('사용자 프로필 로드 실패:', error);
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          nickname: authUser.user_metadata?.nickname || null,
          balance: 1000000,
          isAdmin: false,
        });
      } else {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          nickname: data?.nickname || null,
          balance: data?.balance || 1000000,
          isAdmin: false,
        });
      }
    } catch (err) {
      console.error('프로필 fetch 오류:', err);
    }
  };

  // 로그인 함수 (Supabase + 관리자 로그인)
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // 관리자 로그인 체크
    if (email === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
      const adminUser: UserProfile = {
        id: 'admin-local',
        email: 'admin@projectstock.local',
        nickname: 'ADMIN',
        balance: 999999999,
        isAdmin: true,
      };
      setUser(adminUser);
      localStorage.setItem('admin_session', JSON.stringify(adminUser));
      return { success: true };
    }

    // Supabase 로그인
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setSupabaseUser(data.user);
        await fetchUserProfile(data.user);
        return { success: true };
      }

      return { success: false, error: '로그인 실패' };
    } catch {
      return { success: false, error: '서버 오류가 발생했습니다.' };
    }
  };

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    // 관리자 세션 체크
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      setUser(JSON.parse(adminSession));
      return;
    }

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setSupabaseUser(authUser);
      await fetchUserProfile(authUser);
    }
  };

  // 초기 세션 확인 및 인증 상태 변경 리스너
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      // 관리자 세션 체크
      const adminSession = localStorage.getItem('admin_session');
      if (adminSession) {
        setUser(JSON.parse(adminSession));
        setIsLoading(false);
        return;
      }

      // Supabase 세션 확인
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setSupabaseUser(session.user);
        await fetchUserProfile(session.user);
      }
      
      setIsLoading(false);
    };

    initAuth();

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSupabaseUser(session.user);
          await fetchUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setSupabaseUser(null);
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃
  const logout = async () => {
    try {
      // 관리자 세션 제거
      localStorage.removeItem('admin_session');
      
      // Supabase 로그아웃
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const isLoggedIn = !!user || !!supabaseUser;
  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser, 
      isLoggedIn,
      isLoading,
      isAdmin,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};