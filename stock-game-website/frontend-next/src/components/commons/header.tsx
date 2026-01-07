"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
// [추가] 인증 상태를 가져오기 위한 훅
import { useAuth } from '@/context/AuthContext'; 

// --- 타입 및 데이터 정의 ---
interface MenuItem {
    name: string;
    items: string[];
}

const dropdownMenus: MenuItem[] = [
    { name: 'GAME', items: ['MY PORTFOLIO', 'GAME AREA', 'LEADERBOARD', 'REPLAY'] },
    { name: 'INTEL', items: ['LIVE NEWS', 'MARKET BRIEF', 'CORP REPORTS', 'DISCLOSURES'] },
    { name: 'MISSION', items: ['DAILY OPS', 'WEEKLY CHALLENGE', 'ACHIEVEMENTS', 'REWARDS'] },
    { name: 'RANK', items: ['TOP EARNERS', 'VOLUME LEADERS', 'FRIEND RANK', 'GUILD RANK'] },
];

// --- Dropdown 컴포넌트 ---
const Dropdown: React.FC<{ menu: MenuItem }> = ({ menu }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn } = useAuth(); // 로그인 여부 확인

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className={`px-4 py-2 rounded-sm font-mono text-sm tracking-wider font-bold uppercase transition duration-300 flex items-center group ${
                    isOpen ? 'text-cyan-400 bg-cyan-950/30' : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30'
                }`}
            >
                <span className="relative z-10">{menu.name}</span>
                <svg className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-gray-500 group-hover:text-cyan-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className={`absolute bottom-0 left-0 h-[2px] bg-cyan-400 transition-all duration-300 ${isOpen ? 'w-full animate-pulse' : 'w-0 group-hover:w-full'}`}></span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 top-[34px] pt-[25px] w-max min-w-[140px] z-20"
                    >
                        <div className="relative p-1 bg-black border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
                            <div className="relative z-10 bg-gray-900/90">
                                {menu.items.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={isLoggedIn ? "/game" : "/login"}
                                        className={`block px-4 py-3 text-xs font-mono transition duration-200 border-l-2 border-transparent ${
                                            isLoggedIn 
                                            ? 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/50 hover:border-cyan-400' 
                                            : 'text-gray-600 cursor-not-allowed'
                                        }`}
                                        onClick={(e) => {
                                            if (!isLoggedIn) {
                                                e.preventDefault();
                                                alert("요원 인증이 필요합니다. 로그인 페이지로 이동합니다.");
                                                window.location.href = "/login";
                                            }
                                            setIsOpen(false);
                                        }}
                                    >
                                        {isLoggedIn ? `[ ${item} ]` : `[ LOCKED: ${item} ]`}
                                    </Link>
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
    const { isLoggedIn, logout, user } = useAuth(); // 인증 정보 사용

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

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
                        {isLoggedIn ? (
                            <>
                                <div className="px-4 py-2 bg-cyan-950/20 border border-cyan-900/50 text-cyan-400 text-[10px] mb-4">
                                    <p className="opacity-50">CONNECTED AGENT:</p>
                                    <p className="text-sm font-bold tracking-tighter">{user?.nickname}</p>
                                </div>
                                <Link href="/mypage" onClick={onClose} className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30 border-l-4 border-transparent hover:border-cyan-400 transition-all duration-200 uppercase tracking-wider text-sm">
                                    MY PAGE
                                </Link>
                                <button 
                                    onClick={() => { logout(); onClose(); }}
                                    className="w-full text-left block px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-950/20 border-l-4 border-transparent hover:border-red-500 transition-all duration-200 uppercase tracking-wider text-sm font-bold"
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <Link href="/login" onClick={onClose} className="block px-4 py-3 text-cyan-400 hover:bg-cyan-950/30 border-l-4 border-cyan-400 transition-all duration-200 uppercase tracking-wider text-sm font-bold">
                                LOGIN / ACCESS
                            </Link>
                        )}
                        <Link href="/settings" onClick={onClose} className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30 border-l-4 border-transparent hover:border-cyan-400 transition-all duration-200 uppercase tracking-wider text-sm">
                            SETTINGS
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
};

// --- Header 메인 컴포넌트 ---
const Header: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <header className="bg-black/90 backdrop-blur-md border-b border-cyan-900/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] sticky top-0 z-30 font-mono">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-2xl font-black tracking-tighter text-white group flex items-center">
                                <span className="text-cyan-400 mr-1 group-hover:animate-pulse">■</span>
                                PROJECT <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] ml-1">STOCK</span>
                            </Link>
                        </div>

                        <nav className="hidden md:flex flex-grow justify-center ml-8">
                            <div className="flex space-x-4">
                                {dropdownMenus.map((menu) => (
                                    <Dropdown key={menu.name} menu={menu} />
                                ))}
                            </div>
                        </nav>
                        
                        <div className="flex items-center space-x-6">
                            <div className="relative hidden md:block group">
                                <input
                                    type="text"
                                    placeholder="SEARCH TARGET..."
                                    className="pl-10 pr-4 py-2 text-sm bg-gray-900/50 border border-gray-700 rounded-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 w-56 transition duration-300 text-cyan-100 placeholder-gray-500 font-mono tracking-wider"
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 text-gray-300 hover:text-cyan-400 hover:bg-cyan-950/30 focus:outline-none transition-colors"
                            >
                                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
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