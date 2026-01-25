import React from 'react';
import RankTabs from './_components/RankTabs';
import TopRankers from './_components/TopRankers';
import StockRank from './_components/StockRank';

const RankPage = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400 border-b border-cyan-900 pb-2">RANKING</h1>
      
      {/* Top 3 Rankers */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">TOP TRADERS</h2>
        <TopRankers />
      </div>

      {/* Rank Tabs */}
      <div className="mb-12">
        <RankTabs />
      </div>

      {/* Stock Rank */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-cyan-300">TOP STOCKS</h2>
        <StockRank />
      </div>
    </div>
  );
};

export default RankPage;
