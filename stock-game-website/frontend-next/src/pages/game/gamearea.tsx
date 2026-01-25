"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, UTCTimestamp, IChartApi, CandlestickSeries } from 'lightweight-charts';

export default function GameArea() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null); // 차트 객체 저장용
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const candlestickSeriesRef = useRef<any>(null);

    // 매수/매도 상태
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState('');
    const [sellQuantity, setSellQuantity] = useState('');
    const [currentPrice] = useState(152100); // 현재가 (예시: 삼성전자)

    // 매수/매도 핸들러
    const handleBuyClick = () => setShowBuyModal(true);
    const handleSellClick = () => setShowSellModal(true);

    const executeBuy = () => {
        const quantity = parseInt(buyQuantity);
        if (quantity && quantity > 0) {
            const totalCost = quantity * currentPrice;
            alert(`매수: ${quantity}주\n총 금액: ${totalCost.toLocaleString()}원`);
            setBuyQuantity('');
            setShowBuyModal(false);
        }
    };

    const executeSell = () => {
        const quantity = parseInt(sellQuantity);
        if (quantity && quantity > 0) {
            const totalRevenue = quantity * currentPrice;
            alert(`매도: ${quantity}주\n총 금액: ${totalRevenue.toLocaleString()}원`);
            setSellQuantity('');
            setShowSellModal(false);
        }
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // 1. 차트 초기화
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#000000' },
                textColor: '#06b6d4',
            },
            grid: {
                vertLines: { color: '#111827' },
                horzLines: { color: '#111827' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight || 600,
        });

        // 2. 시리즈 추가
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#ef4444', 
            downColor: '#3b82f6',
            borderUpColor: '#ef4444',
            borderDownColor: '#3b82f6',
            wickUpColor: '#ef4444',
            wickDownColor: '#3b82f6',
        });

        // 3. 테스트 데이터 설정 (에러 지점 해결)
        const sampleData = [
            { time: Math.floor(new Date('2023-01-01').getTime() / 1000) as UTCTimestamp, open: 15000, high: 15500, low: 14800, close: 15300 },
            { time: Math.floor(new Date('2023-01-02').getTime() / 1000) as UTCTimestamp, open: 15300, high: 15800, low: 15200, close: 15600 },
            { time: Math.floor(new Date('2023-01-03').getTime() / 1000) as UTCTimestamp, open: 15600, high: 16000, low: 15500, close: 15900 },
        ];
        
        candlestickSeries.setData(sampleData);

        // 4. 반응형 대응 로직
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        chartRef.current = chart;
        candlestickSeriesRef.current = candlestickSeries;

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="flex h-[calc(100vh-80px)] bg-black font-mono overflow-hidden">
            {/* 왼쪽: 차트 영역 */}
            <div className="flex-1 p-4 relative flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-cyan-400 text-xl font-bold tracking-tighter flex items-center">
                        <span className="animate-pulse mr-2 text-xs">●</span>
                        KOSPI : UNKNOWN TARGET
                    </h2>
                    <div className="flex space-x-2">
                        <button className="text-[10px] border border-cyan-900 px-2 py-1 text-gray-400 hover:text-cyan-400">보조지표</button>
                        <button className="text-[10px] border border-cyan-900 px-2 py-1 text-gray-400 hover:text-cyan-400">매매전략</button>
                    </div>
                </div>
                {/* 차트가 들어갈 컨테이너: flex-1로 남은 높이 다 채움 */}
                <div ref={chartContainerRef} className="flex-1 w-full border border-cyan-900/30" />
            </div>

            {/* 오른쪽: 조작 패널 (이미지 레이아웃 재현) */}
            <div className="w-80 border-l border-cyan-900/50 bg-gray-900/10 p-5 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-red-500 text-lg font-bold">01</span>
                        <span className="text-gray-500 text-sm"> / 50 턴</span>
                    </div>
                    <button className="bg-zinc-800 p-2 rounded-sm hover:bg-cyan-900 transition-colors">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l7-4a1 1 0 000-1.664l-7-4A1 1 0 0010 6v2.798L4.555 5.168z" /></svg>
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-8">
                    <button 
                        onClick={handleBuyClick}
                        className="bg-red-600 hover:bg-red-500 text-white py-3 font-bold rounded-sm text-sm transition-colors"
                    >
                        매수 (A)
                    </button>
                    <button 
                        onClick={handleSellClick}
                        className="bg-blue-600 hover:bg-blue-500 text-white py-3 font-bold rounded-sm text-sm transition-colors"
                    >
                        매도 (S)
                    </button>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-sm mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-400">계임현황</span>
                        <span className="text-[10px] text-gray-600">초기자산 3,846,141 원</span>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400 text-xs">총 평가자산</p>
                        <p className="text-xl font-bold text-white">3,846,141 원</p>
                        <p className="text-gray-500 text-xs mt-1">(-0%)</p>
                    </div>
                </div>

                <div className="flex-1 border border-zinc-800 rounded-sm p-3 relative">
                    <div className="flex text-[10px] border-b border-zinc-800 pb-2 mb-2">
                        <span className="text-cyan-400 border-b border-cyan-400 pb-2">매매내역</span>
                        <span className="ml-4 text-gray-600">게임메모</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-zinc-800 text-[10px]">매매내역이 없습니다.</p>
                    </div>
                </div>
            </div>
            
            {/* 매수 모달 */}
            {showBuyModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="bg-gray-900 border border-cyan-900/50 p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-red-500">매수</h3>
                            <button onClick={() => setShowBuyModal(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-gray-800 p-3 rounded">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">현재가</span>
                                    <span className="font-bold text-white">{currentPrice.toLocaleString()}원</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">수량</label>
                                <input 
                                    type="number" 
                                    value={buyQuantity} 
                                    onChange={(e) => setBuyQuantity(e.target.value)}
                                    className="w-full bg-black border border-gray-700 p-2 text-white"
                                    placeholder="수량 입력"
                                    min="1"
                                />
                            </div>
                            
                            {buyQuantity && (
                                <div className="bg-gray-800 p-3 rounded">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">총 금액</span>
                                        <span className="font-bold text-red-500">
                                            {(parseInt(buyQuantity) * currentPrice).toLocaleString()}원
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => setShowBuyModal(false)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                                >
                                    취소
                                </button>
                                <button 
                                    onClick={executeBuy}
                                    disabled={!buyQuantity || parseInt(buyQuantity) <= 0}
                                    className="bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 rounded font-bold transition-colors"
                                >
                                    매수
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* 매도 모달 */}
            {showSellModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="bg-gray-900 border border-cyan-900/50 p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-blue-500">매도</h3>
                            <button onClick={() => setShowSellModal(false)} className="text-gray-500 hover:text-white">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-gray-800 p-3 rounded">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">현재가</span>
                                    <span className="font-bold text-white">{currentPrice.toLocaleString()}원</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">수량</label>
                                <input 
                                    type="number" 
                                    value={sellQuantity} 
                                    onChange={(e) => setSellQuantity(e.target.value)}
                                    className="w-full bg-black border border-gray-700 p-2 text-white"
                                    placeholder="수량 입력"
                                    min="1"
                                />
                            </div>
                            
                            {sellQuantity && (
                                <div className="bg-gray-800 p-3 rounded">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">총 금액</span>
                                        <span className="font-bold text-blue-500">
                                            {(parseInt(sellQuantity) * currentPrice).toLocaleString()}원
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => setShowSellModal(false)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded"
                                >
                                    취소
                                </button>
                                <button 
                                    onClick={executeSell}
                                    disabled={!sellQuantity || parseInt(sellQuantity) <= 0}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 rounded font-bold transition-colors"
                                >
                                    매도
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}