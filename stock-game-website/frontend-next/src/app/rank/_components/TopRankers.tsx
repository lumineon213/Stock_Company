'use client';

import React from 'react';
import { motion } from 'framer-motion';

const TopRankers = () => {
  // Mock data for top 3 rankers
  const topRankers = [
    {
      rank: 1,
      name: 'StockMaster',
      profit: '₩12,450,000',
      change: '+24.5%',
      avatar: '/avatars/1.png',
    },
    {
      rank: 2,
      name: 'WolfOfWallSt',
      profit: '₩9,870,000',
      change: '+18.2%',
      avatar: '/avatars/2.png',
    },
    {
      rank: 3,
      name: 'BullTrader',
      profit: '₩8,120,000',
      change: '+15.7%',
      avatar: '/avatars/3.png',
    },
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500 to-yellow-600';
      case 2:
        return 'from-gray-400 to-gray-500';
      case 3:
        return 'from-amber-700 to-amber-800';
      default:
        return 'from-cyan-600 to-cyan-700';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {topRankers.map((trader) => (
        <motion.div
          key={trader.rank}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: trader.rank * 0.1 }}
          className={`bg-gradient-to-br ${getRankColor(trader.rank)} rounded-xl p-6 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center text-2xl font-bold text-white">
                {trader.rank}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-white">{trader.name}</h3>
                <p className="text-sm text-gray-200">Rank #{trader.rank}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-300">Total Profit</p>
                <p className="text-xl font-bold text-white">{trader.profit}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-300">This Week</p>
                <p className={`text-lg font-semibold ${
                  trader.change.startsWith('+') ? 'text-green-300' : 'text-red-300'
                }`}>
                  {trader.change}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TopRankers;
