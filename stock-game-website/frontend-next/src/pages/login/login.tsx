"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import supabase from '@/lib/supabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('로그인 실패');

      // 사용자 정보 가져오기 (선택)
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('nickname, balance')
        .eq('user_id', authData.user.id)
        .single();

      if (dbError || !userData) {
        console.warn('사용자 데이터 로드 실패', dbError);
      }

      alert(`로그인 성공!\n환영합니다, ${userData?.nickname || 'Agent'}님`);
      window.location.href = '/'; // 메인 페이지로 이동
    } catch (error: any) {
      setErrorMessage(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-mono flex items-center justify-center relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* 배경 그리드 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
            transformOrigin: 'top center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-1"
      >
        <div className="absolute inset-0 bg-cyan-500 blur-[50px] opacity-10 rounded-full"></div>

        <div className="relative bg-gray-900/80 backdrop-blur-md border border-gray-700 p-8 shadow-2xl">
          {/* HUD 모서리 */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-400"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-cyan-400"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-cyan-400"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-400"></div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
              SYSTEM <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">ACCESS</span>
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase">
              Secure Terminal v.2.0.4
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-cyan-300 uppercase tracking-wider block">Agent ID / Email</label>
              <div className="relative group">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 pl-10 text-cyan-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-gray-600"
                  placeholder="agent@stock.com"
                  required
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-cyan-300 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 pl-10 text-cyan-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 px-4 rounded-sm transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  CONNECTING...
                </span>
              ) : (
                <span className="tracking-widest">CONNECT TO SERVER</span>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase">Or access via</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-2 px-4 border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition rounded-sm">
              {/* Google 아이콘 */}
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
            </button>
            <button className="flex items-center justify-center py-2 px-4 border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition rounded-sm">
              {/* Discord or other 아이콘 */}
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm4.46 15.68h-1.68v-1.13c0-2.43-2.43-2.6-2.43-3.66 0-.64.55-1.12 1.15-1.12.55 0 1.05.39 1.05.97 0 .28.22.5.5.5s.5-.22.5-.5c0-1.13-1.03-1.97-2.05-1.97-1.17 0-2.15.91-2.15 2.12 0 1.63 2.43 1.84 2.43 3.66v1.13H9.24v-1.13c0-2.43 2.43-2.6 2.43-3.66 0-.64-.55-1.12-1.15-1.12-.55 0-1.05.39-1.05.97 0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-1.13 1.03-1.97 2.05-1.97 1.17 0 2.15.91 2.15 2.12 0 1.63-2.43 1.84-2.43 3.66v1.13h4.46z"/></svg>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            NEW AGENT? <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 hover:underline">INITIALIZE REGISTRATION</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;