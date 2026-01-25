'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Trader {
  id: string;
  rank: number;
  name: string;
  profit: number;
  change: number;
  avatar?: string;
  lastUpdated: string;
}

const LiveRankPage = () => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Mock data fetch function - replace with actual API call
  const fetchLiveRankings = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockTraders: Trader[] = Array.from({ length: 20 }, (_, i) => ({
        id: `trader-${i + 1}`,
        rank: i + 1,
        name: `Trader${i + 1}`,
        profit: Math.floor(Math.random() * 10000000) - 2000000, // Random profit between -2M and 8M
        change: parseFloat((Math.random() * 40 - 20).toFixed(2)), // Random change between -20% and 20%
        lastUpdated: new Date().toISOString(),
      }));

      // Sort by profit in descending order
      const sortedTraders = [...mockTraders].sort((a, b) => b.profit - a.profit);
      
      // Update ranks based on sorted order
      const rankedTraders = sortedTraders.map((trader, index) => ({
        ...trader,
        rank: index + 1,
      }));

      setTraders(rankedTraders);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching live rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLiveRankings();
    
    // Set up polling (every 10 seconds)
    const intervalId = setInterval(fetchLiveRankings, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get rank badge color
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50';
    if (rank === 2) return 'bg-gray-500/20 text-gray-300 border-gray-400/50';
    if (rank === 3) return 'bg-amber-700/20 text-amber-400 border-amber-600/50';
    return 'bg-gray-700/30 text-gray-300 border-gray-600/50';
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-400">LIVE RANKING</h1>
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdated}
            <button 
              onClick={fetchLiveRankings}
              disabled={isLoading}
              className="ml-2 px-3 py-1 bg-cyan-900/50 text-cyan-300 rounded text-xs hover:bg-cyan-800/50 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Top 3 Traders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {traders.slice(0, 3).map((trader) => (
            <motion.div
              key={trader.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-xl ${
                trader.rank === 1 
                  ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-900/20 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
                  : trader.rank === 2 
                    ? 'bg-gradient-to-br from-gray-500/10 to-gray-900/20 border border-gray-500/30'
                    : 'bg-gradient-to-br from-amber-700/10 to-amber-900/20 border border-amber-700/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                  trader.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' : 
                  trader.rank === 2 ? 'bg-gray-500/20 text-gray-300' : 'bg-amber-700/20 text-amber-400'
                }`}>
                  {trader.rank}
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Rank</div>
                  <div className="text-2xl font-bold">#{trader.rank}</div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{trader.name}</h3>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Profit</p>
                    <p className={`text-lg font-bold ${
                      trader.profit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(trader.profit)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Change (24h)</p>
                    <p className={`text-lg font-semibold ${
                      trader.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trader.change > 0 ? '+' : ''}{trader.change}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Ranking Table */}
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Trader</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Profit</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">24h Change</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Last Trade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {traders.map((trader) => (
                  <motion.tr 
                    key={trader.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border ${getRankBadgeColor(trader.rank)}`}>
                        {trader.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium">
                          {trader.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">{trader.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                      trader.profit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(trader.profit)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                      trader.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trader.change > 0 ? '+' : ''}{trader.change}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
                      {new Date(trader.lastUpdated).toLocaleTimeString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-800">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">20</span> of{' '}
                  <span className="font-medium">100</span> traders
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </a>
                  <a
                    href="#"
                    className="bg-cyan-900/50 border-cyan-500/50 text-cyan-300 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    2
                  </a>
                  <a
                    href="#"
                    className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    3
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700"
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRankPage;
