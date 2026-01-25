"use client";

import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';

// --- 타입 정의 ---
interface WatchlistStock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface HoldingStock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  broker: string;
  brokerColor: string;
}

interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  totalProfit: number;
  bestReturn: number;
  avgReturn: number;
}

// --- 브로커 옵션 ---
const brokerOptions = [
  { name: '키움증권', color: '#FF6B00' },
  { name: '미래에셋', color: '#0066CC' },
  { name: '토스증권', color: '#3182F6' },
  { name: '한국투자', color: '#00A651' },
  { name: '삼성증권', color: '#0033A0' },
  { name: 'NH투자', color: '#00833E' },
];

// --- 샘플 데이터 ---
const initialWatchlist: WatchlistStock[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 178.50, change: 2.30, changePercent: 1.31 },
  { id: '2', symbol: 'NVDA', name: 'NVIDIA Corp.', currentPrice: 875.20, change: -12.40, changePercent: -1.40 },
];

const initialHoldings: HoldingStock[] = [
  { id: '1', symbol: '005930', name: '삼성전자', quantity: 50, avgPrice: 68000, currentPrice: 72500, broker: '키움증권', brokerColor: '#FF6B00' },
  { id: '2', symbol: 'AAPL', name: 'Apple Inc.', quantity: 10, avgPrice: 165.00, currentPrice: 178.50, broker: '토스증권', brokerColor: '#3182F6' },
];

const sampleGameStats: GameStats = {
  totalGames: 47,
  wins: 31,
  losses: 16,
  winRate: 65.96,
  totalProfit: 2847500,
  bestReturn: 34.2,
  avgReturn: 8.7,
};

// --- 애니메이션 ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

type TabType = 'watchlist' | 'holdings' | 'gamestats';

// --- 모달 컴포넌트 ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="bg-gray-900 border border-cyan-900/50 p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-cyan-400">{title}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
            </div>
            {children}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function MyPortfolio() {
  const [activeTab, setActiveTab] = useState<TabType>('watchlist');
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>(initialWatchlist);
  const [holdings, setHoldings] = useState<HoldingStock[]>(initialHoldings);
  const [gameStats] = useState<GameStats>(sampleGameStats);

  // 모달 상태
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [showHoldingModal, setShowHoldingModal] = useState(false);
  const [editingHolding, setEditingHolding] = useState<HoldingStock | null>(null);

  // 폼 상태
  const [newWatchlist, setNewWatchlist] = useState({ symbol: '', name: '', currentPrice: '' });
  const [newHolding, setNewHolding] = useState({ symbol: '', name: '', quantity: '', avgPrice: '', currentPrice: '', broker: '키움증권' });

  // ID 생성 함수
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // 관심종목 추가
  const addWatchlist = () => {
    if (!newWatchlist.symbol || !newWatchlist.name) return;
    const stock: WatchlistStock = {
      id: generateId(),
      symbol: newWatchlist.symbol.toUpperCase(),
      name: newWatchlist.name,
      currentPrice: parseFloat(newWatchlist.currentPrice) || 0,
      change: 0,
      changePercent: 0,
    };
    setWatchlist(prev => [...prev, stock]);
    setNewWatchlist({ symbol: '', name: '', currentPrice: '' });
    setShowWatchlistModal(false);
  };

  // 관심종목 삭제
  const removeWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(s => s.id !== id));
  };

  // 보유종목 추가/수정
  const saveHolding = () => {
    const broker = brokerOptions.find(b => b.name === newHolding.broker) || brokerOptions[0];
    const stock: HoldingStock = {
      id: editingHolding?.id || generateId(),
      symbol: newHolding.symbol.toUpperCase(),
      name: newHolding.name,
      quantity: parseInt(newHolding.quantity) || 0,
      avgPrice: parseFloat(newHolding.avgPrice) || 0,
      currentPrice: parseFloat(newHolding.currentPrice) || 0,
      broker: broker.name,
      brokerColor: broker.color,
    };

    if (editingHolding) {
      setHoldings(prev => prev.map(h => h.id === editingHolding.id ? stock : h));
    } else {
      setHoldings(prev => [...prev, stock]);
    }

    resetHoldingForm();
  };

  const resetHoldingForm = () => {
    setNewHolding({ symbol: '', name: '', quantity: '', avgPrice: '', currentPrice: '', broker: '키움증권' });
    setEditingHolding(null);
    setShowHoldingModal(false);
  };

  const editHolding = (stock: HoldingStock) => {
    setEditingHolding(stock);
    setNewHolding({
      symbol: stock.symbol,
      name: stock.name,
      quantity: stock.quantity.toString(),
      avgPrice: stock.avgPrice.toString(),
      currentPrice: stock.currentPrice.toString(),
      broker: stock.broker,
    });
    setShowHoldingModal(true);
  };

  const removeHolding = (id: string) => {
    setHoldings(prev => prev.filter(h => h.id !== id));
  };

  // 계산
  const totalValue = holdings.reduce((sum, s) => sum + s.quantity * s.currentPrice, 0);
  const totalCost = holdings.reduce((sum, s) => sum + s.quantity * s.avgPrice, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  const holdingsByBroker = holdings.reduce((acc, stock) => {
    if (!acc[stock.broker]) acc[stock.broker] = { stocks: [], total: 0, color: stock.brokerColor };
    acc[stock.broker].stocks.push(stock);
    acc[stock.broker].total += stock.quantity * stock.currentPrice;
    return acc;
  }, {} as Record<string, { stocks: HoldingStock[], total: number, color: string }>);

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
          <h1 className="text-3xl font-bold tracking-widest">MY PORTFOLIO</h1>
          <div className="flex-grow h-px bg-gray-800" />
        </div>

        {/* 탭 */}
        <div className="flex space-x-1 mb-8 border-b border-gray-800">
          {[
            { id: 'watchlist', label: 'WATCHLIST', icon: '★' },
            { id: 'holdings', label: 'HOLDINGS', icon: '◆' },
            { id: 'gamestats', label: 'GAME STATS', icon: '▶' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-3 text-sm font-bold tracking-wider transition-all border-b-2 ${
                activeTab === tab.id ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* WATCHLIST */}
          {activeTab === 'watchlist' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400 text-sm">관심 종목 {watchlist.length}개</p>
                <button onClick={() => setShowWatchlistModal(true)} className="px-4 py-2 border border-cyan-900 text-cyan-400 text-xs hover:bg-cyan-900/30">
                  + 종목 추가
                </button>
              </div>
              <motion.div className="grid gap-4" variants={containerVariants} initial="hidden" animate="visible">
                {watchlist.length === 0 ? (
                  <div className="text-center py-16 text-gray-600">관심 종목이 없습니다</div>
                ) : watchlist.map((stock) => (
                  <motion.div key={stock.id} variants={itemVariants} className="bg-gray-900/50 border border-gray-800 p-4 hover:border-cyan-900/50 group">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-800 flex items-center justify-center text-cyan-400 font-bold text-xs">{stock.symbol.slice(0, 2)}</div>
                        <div>
                          <p className="font-bold">{stock.name}</p>
                          <p className="text-xs text-gray-500">{stock.symbol}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="font-bold">{stock.currentPrice.toLocaleString()}<span className="text-xs text-gray-500 ml-1">원</span></p>
                          <p className={`text-sm ${stock.change >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toLocaleString()} ({stock.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                        <button onClick={() => removeWatchlist(stock.id)} className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500">✕</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* HOLDINGS */}
          {activeTab === 'holdings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="bg-gray-900/50 border border-gray-800 p-4 flex-1 mr-4">
                  <p className="text-xs text-gray-500">총 평가금액</p>
                  <p className="text-2xl font-bold">{totalValue.toLocaleString()} 원</p>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 p-4 flex-1 mr-4">
                  <p className="text-xs text-gray-500">총 손익</p>
                  <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                    {totalPL >= 0 ? '+' : ''}{totalPL.toLocaleString()} 원 ({totalPLPercent.toFixed(2)}%)
                  </p>
                </div>
                <button onClick={() => { resetHoldingForm(); setShowHoldingModal(true); }} className="px-4 py-2 border border-cyan-900 text-cyan-400 text-xs hover:bg-cyan-900/30 h-fit">
                  + 종목 추가
                </button>
              </div>

              <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                {Object.entries(holdingsByBroker).map(([broker, data]) => (
                  <motion.div key={broker} variants={itemVariants}>
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 mr-2" style={{ backgroundColor: data.color }} />
                      <h3 className="font-bold">{broker}</h3>
                      <span className="ml-auto text-gray-400 text-sm">{data.total.toLocaleString()} 원</span>
                    </div>
                    <div className="space-y-2">
                      {data.stocks.map((stock) => {
                        const pl = (stock.currentPrice - stock.avgPrice) * stock.quantity;
                        const plPercent = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100;
                        return (
                          <div key={stock.id} className="bg-gray-900/30 border border-gray-800/50 p-4 grid grid-cols-6 gap-4 items-center group">
                            <div>
                              <p className="font-bold text-sm">{stock.name}</p>
                              <p className="text-xs text-gray-500">{stock.symbol}</p>
                            </div>
                            <div className="text-center"><p className="text-xs text-gray-500">수량</p><p>{stock.quantity}주</p></div>
                            <div className="text-center"><p className="text-xs text-gray-500">평균</p><p>{stock.avgPrice.toLocaleString()}</p></div>
                            <div className="text-center"><p className="text-xs text-gray-500">현재</p><p>{stock.currentPrice.toLocaleString()}</p></div>
                            <div className="text-right">
                              <p className={`font-bold ${pl >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{pl >= 0 ? '+' : ''}{pl.toLocaleString()}원</p>
                              <p className={`text-xs ${pl >= 0 ? 'text-red-500' : 'text-blue-500'}`}>({plPercent.toFixed(2)}%)</p>
                            </div>
                            <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100">
                              <button onClick={() => editHolding(stock)} className="text-cyan-400 hover:text-cyan-300 text-xs">편집</button>
                              <button onClick={() => removeHolding(stock.id)} className="text-red-400 hover:text-red-300 text-xs">삭제</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
                {holdings.length === 0 && <div className="text-center py-16 text-gray-600">보유 종목이 없습니다</div>}
              </motion.div>
            </div>
          )}

          {/* GAME STATS */}
          {activeTab === 'gamestats' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants} className="bg-gray-900/50 border border-gray-800 p-8 mb-6 text-center">
                <p className="text-xs text-gray-500 mb-2">OVERALL WIN RATE</p>
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">{gameStats.winRate.toFixed(1)}%</div>
                <div className="flex justify-center space-x-8 text-sm">
                  <div><span className="text-green-400 font-bold">{gameStats.wins}</span><span className="text-gray-500 ml-1">승</span></div>
                  <div><span className="text-red-400 font-bold">{gameStats.losses}</span><span className="text-gray-500 ml-1">패</span></div>
                  <div><span className="text-white font-bold">{gameStats.totalGames}</span><span className="text-gray-500 ml-1">전체</span></div>
                </div>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div variants={itemVariants} className="bg-gray-900/30 border border-gray-800/50 p-6">
                  <p className="text-xs text-gray-500 mb-1">누적 수익</p>
                  <p className={`text-2xl font-bold ${gameStats.totalProfit >= 0 ? 'text-red-500' : 'text-blue-500'}`}>{gameStats.totalProfit >= 0 ? '+' : ''}{gameStats.totalProfit.toLocaleString()}원</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-gray-900/30 border border-gray-800/50 p-6">
                  <p className="text-xs text-gray-500 mb-1">최고 수익률</p>
                  <p className="text-2xl font-bold text-yellow-400">+{gameStats.bestReturn}%</p>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-gray-900/30 border border-gray-800/50 p-6">
                  <p className="text-xs text-gray-500 mb-1">평균 수익률</p>
                  <p className={`text-2xl font-bold ${gameStats.avgReturn >= 0 ? 'text-cyan-400' : 'text-blue-500'}`}>{gameStats.avgReturn >= 0 ? '+' : ''}{gameStats.avgReturn}%</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* 관심종목 추가 모달 */}
      <Modal isOpen={showWatchlistModal} onClose={() => setShowWatchlistModal(false)} title="관심 종목 추가">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">종목 코드</label>
            <input value={newWatchlist.symbol} onChange={e => setNewWatchlist({ ...newWatchlist, symbol: e.target.value })}
              className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="AAPL, 005930" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">종목명</label>
            <input value={newWatchlist.name} onChange={e => setNewWatchlist({ ...newWatchlist, name: e.target.value })}
              className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="Apple Inc." />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">현재가</label>
            <input type="number" value={newWatchlist.currentPrice} onChange={e => setNewWatchlist({ ...newWatchlist, currentPrice: e.target.value })}
              className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="178.50" />
          </div>
          <button onClick={addWatchlist} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2">추가</button>
        </div>
      </Modal>

      {/* 보유종목 추가/편집 모달 */}
      <Modal isOpen={showHoldingModal} onClose={resetHoldingForm} title={editingHolding ? "보유 종목 편집" : "보유 종목 추가"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">종목 코드</label>
              <input value={newHolding.symbol} onChange={e => setNewHolding({ ...newHolding, symbol: e.target.value })}
                className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="AAPL" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">종목명</label>
              <input value={newHolding.name} onChange={e => setNewHolding({ ...newHolding, name: e.target.value })}
                className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="Apple Inc." />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">수량</label>
              <input type="number" value={newHolding.quantity} onChange={e => setNewHolding({ ...newHolding, quantity: e.target.value })}
                className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="10" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">평균단가</label>
              <input type="number" value={newHolding.avgPrice} onChange={e => setNewHolding({ ...newHolding, avgPrice: e.target.value })}
                className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="165.00" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">현재가</label>
              <input type="number" value={newHolding.currentPrice} onChange={e => setNewHolding({ ...newHolding, currentPrice: e.target.value })}
                className="w-full bg-black border border-gray-700 p-2 text-white" placeholder="178.50" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">증권사</label>
            <select value={newHolding.broker} onChange={e => setNewHolding({ ...newHolding, broker: e.target.value })}
              className="w-full bg-black border border-gray-700 p-2 text-white">
              {brokerOptions.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
            </select>
          </div>
          <button onClick={saveHolding} className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2">
            {editingHolding ? '저장' : '추가'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
