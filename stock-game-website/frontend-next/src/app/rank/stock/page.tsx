// src/app/rank/stock/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Stock {
  id: string;
  rank: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  market: string;
  industry: string;
  lastUpdated: string;
}

const StockRankPage = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'changePercent' | 'volume' | 'price'>('changePercent');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [marketFilter, setMarketFilter] = useState<'popular' | 'kospi' | 'us'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchStockRankings = async () => {
    try {
      setIsLoading(true);
      
      // 시장에 따라 다른 API 호출
      let apiUrl = '';
      switch (marketFilter) {
        case 'popular':
          apiUrl = '/api/stocks/popular';
          break;
        case 'kospi':
          apiUrl = '/api/stocks/kospi/all';
          break;
        case 'us':
          apiUrl = '/api/stocks/us';
          break;
        default:
          apiUrl = '/api/stocks/popular';
      }
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      
      const stockData = await response.json();
      
      // API 데이터를 Stock 인터페이스에 맞게 변환
      const stocks: Stock[] = stockData.map((stock: any, index: number) => ({
        id: stock.symbol,
        rank: index + 1,
        symbol: stock.symbol,
        name: stock.name || stock.symbol,
        price: stock.price,
        change: stock.change,
        changePercent: stock.change_rate,
        volume: stock.volume || 0,
        market: stock.market || (marketFilter === 'us' ? 'US' : 'KOSPI'),
        industry: stock.industry || (stock.market === 'US' ? 'Technology' : 'Technology'),
        lastUpdated: stock.timestamp,
      }));

      // 정렬 및 필터링
      const sortedStocks = [...stocks].sort((a, b) => {
        if (sortBy === 'changePercent') return b.changePercent - a.changePercent;
        if (sortBy === 'volume') return b.volume - a.volume;
        return b.price - a.price;
      });

      const filteredStocks = sectorFilter === 'all' 
        ? sortedStocks 
        : sortedStocks.filter(stock => stock.industry === sectorFilter);

      const rankedStocks = filteredStocks.map((stock, index) => ({
        ...stock,
        rank: index + 1,
      }));

      setStocks(rankedStocks);
    } catch (error) {
      console.error('Error fetching stock rankings:', error);
      // 에러 시 mock 데이터로 fallback
      const mockStocks: Stock[] = [
        {
          id: '005930',
          rank: 1,
          symbol: '005930',
          name: '삼성전자',
          price: 152100,
          change: -200,
          changePercent: -0.13,
          volume: 15000000,
          market: 'KOSPI',
          industry: 'Technology',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '000660',
          rank: 2,
          symbol: '000660',
          name: 'SK하이닉스',
          price: 767000,
          change: 12000,
          changePercent: 1.59,
          volume: 8000000,
          market: 'KOSPI',
          industry: 'Technology',
          lastUpdated: new Date().toISOString(),
        }
      ];
      setStocks(mockStocks);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockRankings();
  }, [sortBy, sectorFilter, marketFilter]);

  const formatCurrency = (value: number, market: string = 'KOSPI') => {
    if (market === 'US') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
    } else {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(value);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-500/10 text-blue-400',
      'Finance': 'bg-green-500/10 text-green-400',
      'Healthcare': 'bg-purple-500/10 text-purple-400',
      'Consumer': 'bg-yellow-500/10 text-yellow-400',
      'Energy': 'bg-red-500/10 text-red-400',
      'Industrial': 'bg-gray-500/10 text-gray-400',
    };
    return colors[sector] || 'bg-gray-500/10 text-gray-400';
  };

  const paginatedStocks = stocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueSectors = ['all', ...new Set(stocks.map(stock => stock.industry))];
  const totalPages = Math.ceil(stocks.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">STOCK RANKING</h1>
            <p className="text-sm text-gray-400 mt-1">
              Top performing stocks based on {sortBy === 'changePercent' ? 'price change' : sortBy}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Market:</span>
              <select
                value={marketFilter}
                onChange={(e) => { setMarketFilter(e.target.value as any); setCurrentPage(1); }}
                className="bg-gray-800 border border-gray-700 text-sm rounded-md px-3 py-1.5 text-white"
              >
                <option value="popular">인기 종목</option>
                <option value="kospi">KOSPI 전체</option>
                <option value="us">미국 주식</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sector:</span>
              <select
                value={sectorFilter}
                onChange={(e) => { setSectorFilter(e.target.value); setCurrentPage(1); }}
                className="bg-gray-800 border border-gray-700 text-sm rounded-md px-3 py-1.5 text-white"
              >
                {uniqueSectors.map((sector) => (
                  <option key={sector} value={sector}>{sector === 'all' ? 'All Sectors' : sector}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
                className="bg-gray-800 border border-gray-700 text-sm rounded-md px-3 py-1.5 text-white"
              >
                <option value="changePercent">Price Change %</option>
                <option value="volume">Trading Volume</option>
                <option value="price">Stock Price</option>
              </select>
            </div>
            
            <button onClick={fetchStockRankings} disabled={isLoading} className="px-3 py-1.5 bg-cyan-900/50 text-cyan-300 rounded text-sm hover:bg-cyan-800/50 flex items-center gap-1">
              {isLoading ? "Updating..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-green-900/10 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-300 mb-4">Top Gainer</h3>
            {stocks[0] && (
              <div>
                <div className="text-2xl font-bold text-white">{stocks[0].name}</div>
                <div className="text-sm text-gray-400 mb-2">{stocks[0].symbol}</div>
                <div className="text-green-400 font-bold text-xl">+{stocks[0].changePercent.toFixed(2)}%</div>
              </div>
            )}
          </div>
          <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-300 mb-4">Top Loser</h3>
            {stocks[stocks.length - 1] && (
              <div>
                <div className="text-2xl font-bold text-white">{stocks[stocks.length - 1].name}</div>
                <div className="text-sm text-gray-400 mb-2">{stocks[stocks.length - 1].symbol}</div>
                <div className="text-red-400 font-bold text-xl">{stocks[stocks.length - 1].changePercent.toFixed(2)}%</div>
              </div>
            )}
          </div>
          <div className="bg-cyan-900/10 border border-cyan-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">Most Active</h3>
            {stocks.length > 0 && (
              <div>
                <div className="text-2xl font-bold text-white">
                  {[...stocks].sort((a, b) => b.volume - a.volume)[0].name}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  {[...stocks].sort((a, b) => b.volume - a.volume)[0].symbol}
                </div>
                <div className="text-cyan-400 font-bold text-xl">
                  {formatNumber([...stocks].sort((a, b) => b.volume - a.volume)[0].volume)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-cyan-300 uppercase">#</th>
                  <th className="px-6 py-3 text-left text-xs text-cyan-300 uppercase">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs text-cyan-300 uppercase">Company</th>
                  <th className="px-6 py-3 text-right text-xs text-cyan-300 uppercase">Price</th>
                  <th className="px-6 py-3 text-right text-xs text-cyan-300 uppercase">% Change</th>
                  <th className="px-6 py-3 text-right text-xs text-cyan-300 uppercase">Sector</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-10">Loading...</td></tr>
                ) : paginatedStocks.map((stock) => (
                  <motion.tr key={stock.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-sm text-gray-400">{stock.rank}</td>
                    <td className="px-6 py-4 text-sm font-bold text-cyan-300">{stock.symbol}</td>
                    <td className="px-6 py-4 text-sm text-white">{stock.name}</td>
                    <td className="px-6 py-4 text-right text-sm text-white">{formatCurrency(stock.price, stock.market)}</td>
                    <td className={`px-6 py-4 text-right text-sm font-bold ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getSectorColor(stock.industry)}`}>{stock.industry}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${currentPage === page ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockRankPage;