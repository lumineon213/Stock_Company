"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 회원가입 로직 시뮬레이션
    setTimeout(() => {
        setIsLoading(false);
        alert("신규 요원 등록이 완료되었습니다. 승인을 기다리십시오.");
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-mono flex items-center justify-center relative overflow-hidden selection:bg-purple-500 selection:text-white">
      
      {/* 🌌 배경: 로그인과 동일한 디지털 그리드 */}
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

      {/* 🔐 회원가입 카드 컨테이너 */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg p-1"
      >
        {/* 네온 백라이트 효과 (회원가입은 보라색 포인트) */}
        <div className="absolute inset-0 bg-purple-500 blur-[50px] opacity-10 rounded-full"></div>

        {/* 실제 카드 영역 */}
        <div className="relative bg-gray-900/80 backdrop-blur-md border border-gray-700 p-8 shadow-2xl">
          
          {/* HUD 모서리 장식 */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-purple-400"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-purple-400"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-purple-400"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-purple-400"></div>

          {/* 헤더 섹션 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
              AGENT <span className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">REGISTRATION</span>
            </h1>
            <p className="text-gray-400 text-xs tracking-widest uppercase">
              Initialize New Account v.2.0.4
            </p>
          </div>

          {/* 폼 섹션 */}
          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* 요원 이름 (닉네임) */}
            <div className="space-y-2">
              <label className="text-xs text-purple-300 uppercase tracking-wider block">Callsign / Nickname</label>
              <input 
                type="text" 
                className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-600"
                placeholder="Ghost_Trader"
                required
              />
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="text-xs text-purple-300 uppercase tracking-wider block">Security Email</label>
              <input 
                type="email" 
                className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-600"
                placeholder="agent@stock.com"
                required
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-purple-300 uppercase tracking-wider block">Access Key</label>
                <input 
                  type="password" 
                  className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-purple-300 uppercase tracking-wider block">Confirm Key</label>
                <input 
                  type="password" 
                  className="w-full bg-black/50 border border-gray-600 rounded-sm px-4 py-3 text-purple-100 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all placeholder-gray-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* 약관 동의 체크박스 */}
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="terms" className="accent-purple-500 h-4 w-4" required />
              <label htmlFor="terms" className="text-[10px] text-gray-400 uppercase tracking-tighter">
                I accept the <span className="text-purple-400">terms of simulation</span> and data protocols.
              </label>
            </div>

            {/* 가입 버튼 */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-4 rounded-sm transition-all duration-300 mt-4"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  UPLOADING DATA...
                </span>
              ) : (
                <span className="tracking-widest underline decoration-purple-300 decoration-2 underline-offset-4">CREATE NEW IDENTITY</span>
              )}
            </button>
          </form>

          {/* 뒤로 가기 링크 */}
          <div className="mt-8 text-center text-xs text-gray-500">
            ALREADY AN AGENT? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold ml-1 hover:underline">RETURN TO LOGIN</Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;