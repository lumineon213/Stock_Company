"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';


// --- 타입 정의 ---

interface MenuItem {
    name: string;
    items: string[]; // 드롭다운 메뉴 항목
}

// 드롭다운 메뉴 데이터 (게임 컨셉에 맞게 항목명 대문자로 변경)
const dropdownMenus: MenuItem[] = [
    { 
        name: 'GAME', 
        items: ['MY PORTFOLIO', 'GAME AREA', 'LEADERBOARD', 'REPLAY'] 
    },
    { 
        name: 'INTEL', 
        items: ['LIVE NEWS', 'MARKET BRIEF', 'CORP REPORTS', 'DISCLOSURES'] 
    },
    { 
        name: 'MISSION', 
        items: ['DAILY OPS', 'WEEKLY CHALLENGE', 'ACHIEVEMENTS', 'REWARDS'] 
    },
    { 
        name: 'RANK', 
        items: ['TOP EARNERS', 'VOLUME LEADERS', 'FRIEND RANK', 'GUILD RANK'] 
    },
];

// --- Dropdown 컴포넌트 ---

const Dropdown: React.FC<{ menu: MenuItem }> = ({ menu }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                // 디자인 변경: font-mono, uppercase, 텍스트 색상 및 호버 효과 변경
                className={`px-4 py-2 rounded-sm font-mono text-sm tracking-wider font-bold uppercase transition duration-300 flex items-center group ${
                    isOpen ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30'
                }`}
            >
                <span className="relative z-10">{menu.name}</span>
                {/* 드롭다운 화살표 아이콘 */}
                <svg className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {/* 하단 빛나는 라인 효과 */}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-cyan-400 transition-all duration-300 ${isOpen ? 'w-full animate-pulse' : 'w-0 group-hover:w-full'}`}></span>
            </button>

            {/* 드롭다운 패널 애니메이션 및 끊김 방지 적용 */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        
                        // [중요] 위치 조절 및 투명 패딩(Bridge) 추가
                        // top-[60px]: 버튼 근처로 올림 (기존 107px은 너무 멉니다)
                        // pt-[25px]: 버튼과 메뉴 사이의 빈 공간을 채워주는 투명 쿠션
                        className="absolute left-0 top-[34px] pt-[25px] w-max min-w-[140px] z-20"
                    >
                        {/* [실제 디자인 박스] 배경색과 테두리는 여기에 적용 */}
                        <div className="relative p-1 bg-black border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] overflow-hidden">
                            
                            {/* 스캔라인 효과 배경 */}
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
                            
                            <div className="relative z-10 bg-gray-900/90">
                                {menu.items.map((item, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        // 항목 스타일 변경: font-mono, 어두운 배경 호버 효과
                                        className="block px-4 py-3 text-xs font-mono text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/50 transition duration-200 border-l-2 border-transparent hover:border-cyan-400"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        [ {item} ]
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Sidebar 컴포넌트 ---
interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const menuLinks = [
        { name: 'LOGIN', href: '/login' },
        { name: 'MY PAGE', href: '/mypage' },
        { name: 'SETTINGS', href: '/settings' },
        { name: 'FAVORITES', href: '/favorites' },
        { name: 'HISTORY', href: '/history' },
    ];

    return (
        <>
            {/* 1. 배경 오버레이 (클릭 시 닫힘) */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* 2. 사이드바 본체 */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-black border-l border-cyan-500/50 shadow-[-10px_0_20px_rgba(6,182,212,0.2)] z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-6 font-mono">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-cyan-900">
                        <h2 className="text-xl font-bold text-white tracking-widest">
                            SYSTEM <span className="text-cyan-400">MENU</span>
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-cyan-400 transition">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <nav className="space-y-4">
                        {menuLinks.map((link) => (
                            <Link 
                                href={link.href} 
                                key={link.name} 
                                onClick={onClose}
                                className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30 border-l-4 border-transparent hover:border-cyan-400 transition-all duration-200 uppercase tracking-wider text-sm"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
};


// --- Header 컴포넌트 ---

const Header: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            {/* 헤더 배경 변경: 검은색 반투명, 하단 사이언 보더 */}
            <header className="bg-black/90 backdrop-blur-md border-b border-cyan-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] sticky top-0 z-30 font-mono">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        
                        {/* 1. 왼쪽 - 프로젝트명 (로고 디자인 변경) */}
                        <div className="flex-shrink-0">
                            <a href="/" className="text-2xl font-black tracking-tighter text-white group flex items-center">
                                <span className="text-cyan-400 mr-1 group-hover:animate-pulse">■</span>
                                PROJECT <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] ml-1">STOCK</span>
                            </a>
                        </div>

                        {/* 2. 중앙 - 드롭다운 메뉴 */}
                        <nav className="hidden md:flex flex-grow justify-center ml-8">
                            <div className="flex space-x-4">
                                {dropdownMenus.map((menu) => (
                                    <Dropdown key={menu.name} menu={menu} />
                                ))}
                            </div>
                        </nav>
                        
                        {/* 3. 오른쪽 - 검색창 및 3선 메뉴 버튼 */}
                        <div className="flex items-center space-x-6">
                            
                            {/* 검색창 디자인 변경: 어두운 배경, 사이언 포커스 */}
                            <div className="relative hidden md:block group">
                                <input
                                    type="text"
                                    placeholder="SEARCH TARGET..."
                                    className="pl-10 pr-4 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 w-56 transition duration-300
                                               text-cyan-100 placeholder-gray-500 font-mono tracking-wider"
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            
                            {/* 3선 메뉴 버튼 디자인 변경 */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                type="button"
                                className="p-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30 focus:outline-none transition-colors"
                                aria-label="Toggle menu"
                            >
                                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {/* 헤더 하단 진행률 바 같은 장식 */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            </header>
            
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />
        </>
    );
};

export default Header;