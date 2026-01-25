"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import supabase from '@/lib/supabaseClient';



const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Supabase 인증 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nickname }, // 메타데이터에 닉네임 저장
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('사용자 생성 실패');

      // 2. users 테이블에 추가 정보 저장
      const { error: dbError } = await supabase.from('users').insert({
        user_id: authData.user.id,
        nickname,
        balance: 1000000,
      });

      if (dbError) throw dbError;

      alert('회원가입 성공!\n이메일 확인 후 로그인해주세요.');
      window.location.href = '/login';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-mono flex items-center justify-center relative overflow-hidden selection:bg-purple-500 selection:text-white">
      {/* 배경 그리드 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)`,
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
        className="relative z-10 w-full max-w-lg p-1"
      >
        <div className="absolute inset-0 bg-purple-500 blur-[50px] opacity-10 rounded-full"></div>

        <div className="relative bg-gray-900/80 backdrop-blur-md border border-gray-700 p-8 shadow-2xl">
          {/* HUD 모서리 */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-purple-400"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-purple-400"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-purple-400"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-purple-400"></div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
              AGENT <span className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">REGISTRATION</span>
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase">
              Initialize New Account v.2.0.4
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs text-purple-300 uppercase tracking-wider block">Callsign / Nickname</label>
              <input 
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-600"
                placeholder="Ghost_Trader"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-purple-300 uppercase tracking-wider block">Security Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-600"
                placeholder="agent@stock.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-purple-300 uppercase tracking-wider block">Access Key</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-purple-300 uppercase tracking-wider block">Confirm Key</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="terms" className="accent-purple-500 h-4 w-4" required />
              <label htmlFor="terms" className="text-[10px] text-gray-400 uppercase tracking-tighter">
                I accept the <span className="text-purple-400">terms of simulation</span> and data protocols.
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-4 rounded-sm transition-all duration-300 mt-4"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  UPLOADING DATA...
                </span>
              ) : (
                <span className="tracking-widest underline decoration-purple-300 decoration-2 underline-offset-4">
                  CREATE NEW IDENTITY
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500">
            ALREADY AN AGENT? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold ml-1 hover:underline">RETURN TO LOGIN</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;