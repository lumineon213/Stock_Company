'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

const StockRank = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/stocks/popular');
        if (response.ok) {
          const data = await response.json();
          const formattedStocks = data.slice(0, 5).map((stock: any) => ({
            symbol: stock.symbol,
            name: stock.name || stock.symbol, // API에서 name 필드 사용
            price: stock.price,
            change: stock.change,
            changePercent: stock.change_rate,
            volume: stock.volume || 0,
          }));
          setStocks(formattedStocks);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
        // Fallback 데이터
        setStocks([
          {
            symbol: '005930',
            name: '삼성전자',
            price: 152100,
            change: -200,
            changePercent: -0.13,
            volume: 15000000,
          },
          {
            symbol: '000660',
            name: 'SK하이닉스',
            price: 767000,
            change: 12000,
            changePercent: 1.59,
            volume: 8000000,
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(value);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
        <div className="text-center py-10">
          <div className="text-gray-400">Loading stock data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-cyan-500/20 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Change</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider">Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {stocks.map((stock, index) => (
              <motion.tr 
                key={stock.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-bold text-cyan-300">{stock.symbol}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{stock.name}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-white">{formatCurrency(stock.price)}</div>
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-right ${
                  stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <div className="text-sm font-semibold">
                    {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-400">{formatNumber(stock.volume)}</div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 bg-gray-800/30 text-right text-sm">
        <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
          View All Stocks →
        </button>
      </div>
    </div>
  );
};

export default StockRank;
