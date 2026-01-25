'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiTrendingUp, FiBarChart2, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

interface Trader {
  id: string;
  rank: number;
  name: string;
  profit: number;
  monthlyChange: number;
  totalTrades: number;
  winRate: number;
  avgTradeReturn: number;
  consistency: number;
  lastUpdated: string;
}

const MonthlyRankPage = () => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('this-month');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMetric, setSelectedMetric] = useState<'profit' | 'winRate' | 'consistency'>('profit');
  const itemsPerPage = 15;

  // Mock data fetch function - replace with actual API call
  const fetchMonthlyRankings = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock data with monthly-specific metrics
      const mockTraders: Trader[] = Array.from({ length: 50 }, (_, i) => {
        const profit = Math.floor(Math.random() * 50000000) - 10000000;
        const monthlyChange = parseFloat((Math.random() * 100 - 30).toFixed(2));
        const winRate = Math.floor(Math.random() * 30) + 60; // 60-90%
        const avgTradeReturn = parseFloat((Math.random() * 15 + 1).toFixed(2));
        const consistency = Math.floor(Math.random() * 30) + 60; // 60-90%
        
        return {
          id: `trader-${i + 1}`,
          rank: i + 1,
          name: `Trader${i + 1}`,
          profit,
          monthlyChange,
          totalTrades: Math.floor(Math.random() * 200) + 20,
          winRate,
          avgTradeReturn,
          consistency,
          lastUpdated: new Date().toISOString(),
        };
      });

      // Sort by selected metric
      const sortedTraders = [...mockTraders].sort((a, b) => {
        if (selectedMetric === 'profit') {
          return b.profit - a.profit;
        } else if (selectedMetric === 'winRate') {
          return b.winRate - a.winRate;
        } else {
          return b.consistency - a.consistency;
        }
      });
      
      // Update ranks based on sorted order
      const rankedTraders = sortedTraders.map((trader, index) => ({
        ...trader,
        rank: index + 1,
      }));

      setTraders(rankedTraders);
    } catch (error) {
      console.error('Error fetching monthly rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMonthlyRankings();
  }, [timeRange, selectedMetric]);

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

  // Get paginated traders
  const paginatedTraders = traders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Get current month and previous month
  const now = new Date();
  const currentMonth = getMonthName(now);
  const lastMonth = getMonthName(new Date(now.getFullYear(), now.getMonth() - 1, 1));
  const lastYear = getMonthName(new Date(now.getFullYear() - 1, now.getMonth(), 1));

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">MONTHLY RANKING</h1>
            <p className="text-sm text-gray-400 mt-1">
              {timeRange === 'this-month' 
                ? currentMonth 
                : timeRange === 'last-month' 
                  ? lastMonth 
                  : lastYear}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Time Range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-sm rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-year">Same Month Last Year</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort By:</span>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value as any)}
                className="bg-gray-800 border border-gray-700 text-sm rounded-md px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="profit">Total Profit</option>
                <option value="winRate">Win Rate</option>
                <option value="consistency">Consistency</option>
              </select>
            </div>
            
            <button 
              onClick={fetchMonthlyRankings}
              disabled={isLoading}
              className="px-3 py-1.5 bg-cyan-900/50 text-cyan-300 rounded text-sm hover:bg-cyan-800/50 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Top 3 Monthly Performers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {traders.slice(0, 3).map((trader) => (
            <motion.div
              key={trader.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: trader.rank * 0.1 }}
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
                  <div className="text-xs text-gray-400">Monthly Rank</div>
                  <div className="text-2xl font-bold">#{trader.rank}</div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1">{trader.name}</h3>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Monthly P&L</p>
                    <p className={`text-lg font-bold ${
                      trader.profit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(trader.profit)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Monthly Change</p>
                    <p className={`text-lg font-semibold ${
                      trader.monthlyChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trader.monthlyChange > 0 ? '+' : ''}{trader.monthlyChange}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Win Rate</p>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-cyan-300 mr-2">
                        {trader.winRate}%
                      </span>
                      <div className="w-16 bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-cyan-500 h-1.5 rounded-full" 
                          style={{ width: `${trader.winRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Avg. Return</p>
                    <p className={`text-sm font-medium ${
                      trader.avgTradeReturn >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trader.avgTradeReturn > 0 ? '+' : ''}{trader.avgTradeReturn}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly Ranking Table */}
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Trader</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Monthly P&L</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Monthly Change</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Win Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Trades</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Avg. Return</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Consistency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">Loading monthly rankings...</p>
                    </td>
                  </tr>
                ) : paginatedTraders.length > 0 ? (
                  paginatedTraders.map((trader) => (
                    <motion.tr 
                      key={trader.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
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
                            <div className="text-xs text-gray-400">Rank #{trader.rank}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        trader.profit >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatCurrency(trader.profit)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                        trader.monthlyChange >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trader.monthlyChange > 0 ? '+' : ''}{trader.monthlyChange}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          <span className="text-sm text-gray-300 mr-2">{trader.winRate}%</span>
                          <div className="w-16 bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-cyan-500 h-1.5 rounded-full" 
                              style={{ width: `${trader.winRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                        {trader.totalTrades}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                        trader.avgTradeReturn >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trader.avgTradeReturn > 0 ? '+' : ''}{trader.avgTradeReturn}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end">
                          <span className="text-sm text-gray-300 mr-2">{trader.consistency}%</span>
                          <div className="w-16 bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-purple-500 h-1.5 rounded-full" 
                              style={{ width: `${trader.consistency}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                      No monthly ranking data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {traders.length > 0 && (
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-800">
              <div className="flex-1 flex justify-between sm:hidden">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * itemsPerPage >= traders.length}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, traders.length)}
                    </span> of{' '}
                    <span className="font-medium">{traders.length}</span> traders
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    
                    {Array.from({ length: Math.ceil(traders.length / itemsPerPage) }, (_, i) => i + 1)
                      .filter(page => {
                        // Show first, last, and pages around current page
                        return (
                          page === 1 ||
                          page === Math.ceil(traders.length / itemsPerPage) ||
                          Math.abs(page - currentPage) <= 1
                        );
                      })
                      .map((page, i, array) => {
                        // Add ellipsis if there's a gap
                        if (i > 0 && page - array[i - 1] > 1) {
                          return (
                            <React.Fragment key={`ellipsis-${i}`}>
                              <span className="relative inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400">
                                ...
                              </span>
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 border ${
                                  currentPage === page 
                                    ? 'bg-cyan-900/50 border-cyan-500/50 text-cyan-300' 
                                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                                } text-sm font-medium`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border ${
                              currentPage === page 
                                ? 'bg-cyan-900/50 border-cyan-500/50 text-cyan-300' 
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                            } text-sm font-medium`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage * itemsPerPage >= traders.length}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Monthly Performance Metrics */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Performer Card */}
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-300 flex items-center">
                <FiAward className="mr-2" /> Top Performer
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 rounded-full">
                #{traders[0]?.rank || '1'}
              </span>
            </div>
            {traders[0] ? (
              <div>
                <div className="text-2xl font-bold text-white mb-2">{traders[0].name}</div>
                <div className="text-3xl font-bold text-yellow-400 mb-4">{formatCurrency(traders[0].profit)}</div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Win Rate: <span className="text-green-400">{traders[0].winRate}%</span></span>
                  <span>Trades: <span className="text-cyan-300">{traders[0].totalTrades}</span></span>
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
          
          {/* Best Win Rate */}
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-300 flex items-center">
                <FiTrendingUp className="mr-2" /> Best Win Rate
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full">
                {Math.max(...traders.map(t => t.winRate))}%
              </span>
            </div>
            {traders.length > 0 ? (
              <div>
                <div className="text-2xl font-bold text-white mb-2">
                  {[...traders].sort((a, b) => b.winRate - a.winRate)[0]?.name}
                </div>
                <div className="text-3xl font-bold text-green-400 mb-4">
                  {Math.max(...traders.map(t => t.winRate))}%
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Total P&L: <span className="text-yellow-400">
                    {formatCurrency([...traders].sort((a, b) => b.winRate - a.winRate)[0]?.profit || 0)}
                  </span></span>
                  <span>Trades: <span className="text-cyan-300">
                    {[...traders].sort((a, b) => b.winRate - a.winRate)[0]?.totalTrades}
                  </span></span>
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
          
          {/* Most Consistent */}
          <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-300 flex items-center">
                <FiCheckCircle className="mr-2" /> Most Consistent
              </h3>
              <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full">
                {Math.max(...traders.map(t => t.consistency))}%
              </span>
            </div>
            {traders.length > 0 ? (
              <div>
                <div className="text-2xl font-bold text-white mb-2">
                  {[...traders].sort((a, b) => b.consistency - a.consistency)[0]?.name}
                </div>
                <div className="text-3xl font-bold text-purple-400 mb-4">
                  {Math.max(...traders.map(t => t.consistency))}%
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Win Rate: <span className="text-green-400">
                    {[...traders].sort((a, b) => b.consistency - a.consistency)[0]?.winRate}%
                  </span></span>
                  <span>Avg. Return: <span className="text-cyan-300">
                    {[...traders].sort((a, b) => b.consistency - a.consistency)[0]?.avgTradeReturn}%
                  </span></span>
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRankPage;
