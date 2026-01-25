'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const RankTabs = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('live');

  const tabs = [
    { id: 'live', label: 'LIVE RANK', path: '/rank/live' },
    { id: 'weekly', label: 'WEEKLY RANK', path: '/rank/weekly' },
    { id: 'monthly', label: 'MONTHLY RANK', path: '/rank/monthly' },
  ];

  return (
    <div className="border-b border-gray-800 mb-6">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.path}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
              pathname === tab.path
                ? 'bg-cyan-900/50 text-cyan-400 border-t border-l border-r border-cyan-500/50'
                : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-800/50'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      
      {/* Rank Table */}
      <div className="bg-gray-900/50 border border-cyan-500/20 rounded-b-lg p-4">
        {activeTab === 'live' && <RankTable type="live" />}
        {activeTab === 'weekly' && <RankTable type="weekly" />}
        {activeTab === 'monthly' && <RankTable type="monthly" />}
      </div>
    </div>
  );
};

const RankTable = ({ type }: { type: 'live' | 'weekly' | 'monthly' }) => {
  // Mock data - replace with actual API call
  const mockRanks = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: `Trader${i + 1}`,
    profit: Math.floor(Math.random() * 1000000).toLocaleString(),
    change: (Math.random() * 20 - 10).toFixed(2) + '%',
  }));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trader</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Profit</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {mockRanks.map((trader) => (
            <tr key={trader.rank} className="hover:bg-gray-800/50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                  trader.rank <= 3 
                    ? 'bg-yellow-500/20 text-yellow-400' 
                    : 'bg-gray-700/50 text-gray-300'
                }`}>
                  {trader.rank}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-cyan-300">
                {trader.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                ₩{trader.profit}
              </td>
              <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${
                trader.change.startsWith('-') ? 'text-red-400' : 'text-green-400'
              }`}>
                {trader.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankTabs;
