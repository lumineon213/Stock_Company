"use client";
import React from 'react';
// 1. Variants 타입을 추가로 import 했습니다.
import { motion, Variants } from 'framer-motion';

// --- 데이터 정의 (게임 컨셉) ---
const features = [
  {
    title: 'BATTLE ARENA',
    subtitle: '실시간 가상 거래소',
    description: '실제 시장 데이터를 기반으로 플레이어들과 수익률을 경쟁하십시오.',
    icon: (
      <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    href: '/game',
  },
  {
    title: 'INTEL REPORT',
    subtitle: 'AI 뉴스 분석',
    description: 'AI 에이전트가 분석한 1급 금융 정보를 획득하여 전략을 수립하세요.',
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    href: '/news',
  },
  {
    title: 'LEADERBOARD',
    subtitle: '랭킹 시스템',
    description: '최고의 트레이더가 되어 명예의 전당에 이름을 올리세요.',
    icon: (
      <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    href: '/rank',
  },
];

// --- 애니메이션 설정 ---

// 2. 변수 타입으로 ': Variants'를 명시했습니다.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

// 3. 변수 타입으로 ': Variants'를 명시했습니다.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100 } 
  },
  hover: { 
    scale: 1.05, 
    boxShadow: "0px 0px 20px rgba(6, 182, 212, 0.5)", // Cyan glow
    borderColor: "#22d3ee",
    transition: { duration: 0.3 }
  }
};

const MainPage: React.FC = () => {
  return (
    <div className="bg-black min-h-screen font-sans text-white overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* 🌌 배경: 디지털 그리드 (CSS로 구현된 배경) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* 그리드 패턴 */}
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
        {/* 비네팅 효과 (가장자리 어둡게) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      {/* 1. 🥇 Hero Section (메인 배너) */}
      <section className="relative z-10 pt-32 pb-40 text-center flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* 상단 장식 라인 */}
        <motion.div 
          initial={{ width: 0 }} animate={{ width: "200px" }} transition={{ duration: 1 }}
          className="h-1 bg-cyan-500 mb-8 shadow-[0_0_10px_#06b6d4]"
        />

        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-lg"
        >
          PROJECT <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">STOCK</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-cyan-100/70 mb-12 max-w-2xl font-mono"
        >
          [SYSTEM]: 금융 데이터 동기화 완료.<br/>
          현실과 동일한 시뮬레이션 환경에 접속하시겠습니까?
        </motion.p>
        
        {/* CTA 버튼: 게임 스타트 버튼 느낌 */}
        <motion.a
          href="/game"
          whileHover={{ scale: 1.1, backgroundColor: "#06b6d4", color: "#000" }}
          whileTap={{ scale: 0.95 }}
          className="relative group px-12 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 text-xl font-bold uppercase tracking-widest overflow-hidden"
        >
          <span className="relative z-10">Game Start</span>
          {/* 버튼 배경 채워지는 효과 */}
          <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out -z-0" />
        </motion.a>

      </section>

      {/* 2. 🚀 Mission Briefing (주요 기능) - HUD 스타일 */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-16 space-x-4">
            <div className="h-4 w-4 bg-cyan-500 animate-pulse" />
            <h2 className="text-3xl font-bold text-white tracking-widest">MISSION OBJECTIVES</h2>
            <div className="flex-grow h-px bg-gray-800" />
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={cardVariants}
                whileHover="hover"
                className="relative bg-gray-900/80 backdrop-blur-sm p-8 border border-gray-700 group"
              >
                {/* HUD 모서리 장식 (Corner Brackets) */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors" />

                <div className="mb-6 p-3 bg-gray-800 w-fit rounded-lg border border-gray-600 group-hover:border-cyan-500 transition-colors">
                  {feature.icon}
                </div>
                
                <h4 className="text-sm font-bold text-cyan-400 mb-1 tracking-wider">{feature.title}</h4>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-200 transition-colors">
                  {feature.subtitle}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. 🌟 Join The Server (최종 CTA) */}
      <section className="relative z-10 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20" />
          <h2 className="relative text-4xl md:text-5xl font-bold mb-8">
            SERVER STATUS: <span className="text-green-400">ONLINE</span>
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            지금 바로 서버에 접속하여 당신의 첫 번째 거래를 시작하십시오.
            <br/>초기 자금과 튜토리얼 퀘스트가 지급됩니다.
          </p>
          
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-lg rounded hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-cyan-500/30"
          >
            CREATE ACCOUNT
          </a>
        </motion.div>
      </section>

    </div>
  );
};

export default MainPage;