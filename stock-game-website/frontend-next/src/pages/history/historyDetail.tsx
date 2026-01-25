"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// --- 타입 정의 ---
interface TradeRecord {
  id: string;
  turn: number;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  total: number;
  timestamp: string;
}

interface GameDetail {
  id: string;
  date: string;
  stockName: string;
  stockSymbol: string;
  startBalance: number;
  endBalance: number;
  totalTrades: number;
  profit: number;
  profitPercent: number;
  result: 'win' | 'loss';
  duration: string;
  trades: TradeRecord[];
  memo: string;
}

// --- 샘플 데이터 ---
const sampleGameDetail: GameDetail = {
  id: '1',
  date: '2026-01-25',
  stockName: '삼성전자',
  stockSymbol: '005930',
  startBalance: 1000000,
  endBalance: 1234500,
  totalTrades: 8,
  profit: 234500,
  profitPercent: 23.45,
  result: 'win',
  duration: '15분 32초',
  memo: '상승 추세에서 분할 매수 전략 사용. 3번째 턴에서 급등 신호 포착.',
  trades: [
    { id: '1', turn: 5, type: 'buy', price: 72000, quantity: 5, total: 360000, timestamp: '10:05:23' },
    { id: '2', turn: 12, type: 'buy', price: 71500, quantity: 3, total: 214500, timestamp: '10:12:45' },
    { id: '3', turn: 18, type: 'sell', price: 73500, quantity: 4, total: 294000, timestamp: '10:18:12' },
    { id: '4', turn: 25, type: 'buy', price: 72800, quantity: 5, total: 364000, timestamp: '10:25:33' },
    { id: '5', turn: 32, type: 'sell', price: 75000, quantity: 6, total: 450000, timestamp: '10:32:18' },
    { id: '6', turn: 38, type: 'buy', price: 74200, quantity: 4, total: 296800, timestamp: '10:38:55' },
    { id: '7', turn: 45, type: 'sell', price: 76500, quantity: 7, total: 535500, timestamp: '10:45:02' },
    { id: '8', turn: 50, type: 'sell', price: 77000, quantity: 0, total: 0, timestamp: '10:50:00' },
  ],
};

interface HistoryDetailProps {
  gameId: string;
}

export default function HistoryDetail({ gameId: _gameId }: HistoryDetailProps) {
  // 실제로는 _gameId로 데이터를 fetch해야 함 (현재는 샘플 데이터 사용)
  const game = sampleGameDetail;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* 배경 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* 뒤로가기 */}
        <Link href="/history" className="inline-flex items-center text-gray-500 hover:text-cyan-400 mb-6 transition-colors">
          ← BACK TO HISTORY
        </Link>

        {/* 헤더 */}
        <div className="flex items-center mb-8 space-x-4">
          <div className={`w-16 h-16 flex items-center justify-center font-black text-2xl ${
            game.result === 'win' ? 'bg-green-900/50 text-green-400 border border-green-500/50' : 'bg-red-900/50 text-red-400 border border-red-500/50'
          }`}>
            {game.result === 'win' ? 'W' : 'L'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{game.stockName}</h1>
            <p className="text-gray-500">{game.stockSymbol} · {game.date} · {game.duration}</p>
          </div>
        </div>

        {/* 결과 요약 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 border border-gray-800 p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">시작 자산</p>
              <p className="text-xl font-bold">{game.startBalance.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">종료 자산</p>
              <p className="text-xl font-bold">{game.endBalance.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">실현 손익</p>
              <p className={`text-xl font-bold ${game.profit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {game.profit >= 0 ? '+' : ''}{game.profit.toLocaleString()}원
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">수익률</p>
              <p className={`text-xl font-bold ${game.profitPercent >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {game.profitPercent >= 0 ? '+' : ''}{game.profitPercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* 거래 내역 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
            <span className="mr-2">◆</span> 거래 내역 ({game.totalTrades}건)
          </h2>
          <div className="space-y-2">
            {game.trades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gray-900/30 border p-4 grid grid-cols-6 gap-4 items-center ${
                  trade.type === 'buy' ? 'border-red-900/30' : 'border-blue-900/30'
                }`}
              >
                <div>
                  <p className="text-xs text-gray-500">턴</p>
                  <p className="font-bold">{trade.turn}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">유형</p>
                  <p className={`font-bold ${trade.type === 'buy' ? 'text-red-400' : 'text-blue-400'}`}>
                    {trade.type === 'buy' ? '매수' : '매도'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">가격</p>
                  <p className="font-bold">{trade.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">수량</p>
                  <p className="font-bold">{trade.quantity}주</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">금액</p>
                  <p className="font-bold">{trade.total.toLocaleString()}원</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{trade.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 게임 메모 */}
        {game.memo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/30 border border-gray-800 p-6"
          >
            <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
              <span className="mr-2">◆</span> 게임 메모
            </h2>
            <p className="text-gray-300 leading-relaxed">{game.memo}</p>
          </motion.div>
        )}

        {/* 다시 플레이 버튼 */}
        <div className="mt-8 text-center">
          <Link href="/gamearea" className="inline-block px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold transition-colors">
            NEW GAME START
          </Link>
        </div>
      </div>
    </div>
  );
}
