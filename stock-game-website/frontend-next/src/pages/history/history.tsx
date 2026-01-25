"use client";

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

// --- 타입 정의 ---
interface GameRecord {
  id: string;
  date: string;
  stockName: string;
  startBalance: number;
  endBalance: number;
  totalTrades: number;
  profit: number;
  profitPercent: number;
  result: 'win' | 'loss';
  duration: string;
}

// --- 샘플 데이터 ---
const sampleRecords: GameRecord[] = [
  { id: '1', date: '2026-01-25', stockName: '삼성전자', startBalance: 1000000, endBalance: 1234500, totalTrades: 8, profit: 234500, profitPercent: 23.45, result: 'win', duration: '15분 32초' },
  { id: '2', date: '2026-01-24', stockName: 'NVIDIA', startBalance: 1000000, endBalance: 876000, totalTrades: 12, profit: -124000, profitPercent: -12.40, result: 'loss', duration: '22분 15초' },
  { id: '3', date: '2026-01-23', stockName: '카카오', startBalance: 1000000, endBalance: 1089000, totalTrades: 5, profit: 89000, profitPercent: 8.90, result: 'win', duration: '10분 45초' },
  { id: '4', date: '2026-01-22', stockName: 'Apple Inc.', startBalance: 1000000, endBalance: 1156700, totalTrades: 7, profit: 156700, profitPercent: 15.67, result: 'win', duration: '18분 20초' },
  { id: '5', date: '2026-01-21', stockName: 'Tesla', startBalance: 1000000, endBalance: 945000, totalTrades: 15, profit: -55000, profitPercent: -5.50, result: 'loss', duration: '25분 10초' },
  { id: '6', date: '2026-01-20', stockName: 'LG에너지솔루션', startBalance: 1000000, endBalance: 1342000, totalTrades: 6, profit: 342000, profitPercent: 34.20, result: 'win', duration: '12분 55초' },
];

// --- 애니메이션 ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function History() {
  const [records] = useState<GameRecord[]>(sampleRecords);
  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all');

  const filteredRecords = records.filter(r => {
    if (filter === 'all') return true;
    return r.result === filter;
  });

  // 통계
  const totalGames = records.length;
  const wins = records.filter(r => r.result === 'win').length;
  const losses = records.filter(r => r.result === 'loss').length;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;
  const totalProfit = records.reduce((sum, r) => sum + r.profit, 0);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* 배경 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center mb-8 space-x-4">
          <div className="h-4 w-4 bg-cyan-500 animate-pulse" />
          <h1 className="text-3xl font-bold tracking-widest">GAME HISTORY</h1>
          <div className="flex-grow h-px bg-gray-800" />
        </div>

        {/* 통계 요약 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">총 게임</p>
            <p className="text-2xl font-bold">{totalGames}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">승리</p>
            <p className="text-2xl font-bold text-green-400">{wins}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">패배</p>
            <p className="text-2xl font-bold text-red-400">{losses}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">승률</p>
            <p className="text-2xl font-bold text-cyan-400">{winRate.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4">
            <p className="text-xs text-gray-500 mb-1">누적 수익</p>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 필터 */}
        <div className="flex space-x-2 mb-6">
          {[
            { id: 'all', label: '전체' },
            { id: 'win', label: '승리' },
            { id: 'loss', label: '패배' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as 'all' | 'win' | 'loss')}
              className={`px-4 py-2 text-xs font-bold border transition-all ${
                filter === f.id
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                  : 'border-gray-700 text-gray-500 hover:text-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 게임 기록 목록 */}
        <motion.div
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredRecords.length === 0 ? (
            <div className="text-center py-16 text-gray-600">게임 기록이 없습니다</div>
          ) : filteredRecords.map((record) => (
            <motion.div key={record.id} variants={itemVariants}>
              <Link href={`/history/${record.id}`}>
                <div className="bg-gray-900/50 border border-gray-800 p-4 hover:border-cyan-900/50 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    {/* 왼쪽: 날짜, 종목, 결과 */}
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 flex items-center justify-center font-bold text-lg ${
                        record.result === 'win' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                      }`}>
                        {record.result === 'win' ? 'W' : 'L'}
                      </div>
                      <div>
                        <p className="font-bold">{record.stockName}</p>
                        <p className="text-xs text-gray-500">{record.date} · {record.duration}</p>
                      </div>
                    </div>

                    {/* 중앙: 거래 정보 */}
                    <div className="hidden md:flex space-x-8 text-center">
                      <div>
                        <p className="text-xs text-gray-500">시작 자산</p>
                        <p className="font-bold">{record.startBalance.toLocaleString()}원</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">종료 자산</p>
                        <p className="font-bold">{record.endBalance.toLocaleString()}원</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">거래 횟수</p>
                        <p className="font-bold">{record.totalTrades}회</p>
                      </div>
                    </div>

                    {/* 오른쪽: 수익 */}
                    <div className="text-right">
                      <p className={`text-xl font-bold ${record.profit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                        {record.profit >= 0 ? '+' : ''}{record.profit.toLocaleString()}원
                      </p>
                      <p className={`text-sm ${record.profit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                        ({record.profitPercent >= 0 ? '+' : ''}{record.profitPercent.toFixed(2)}%)
                      </p>
                    </div>

                    {/* 화살표 */}
                    <div className="ml-4 text-gray-600 group-hover:text-cyan-400 transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
