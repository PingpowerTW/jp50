
import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
    userProfile: UserProfile | null;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onSettingsClick: () => void;
}

const LogoutIcon = () => (
    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

const SettingsIcon = () => (
    <svg className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);


const Header: React.FC<HeaderProps> = ({ userProfile, onLoginClick, onLogoutClick, onSettingsClick }) => {
    return (
        <header className="w-full max-w-6xl mb-8 sm:mb-12 flex items-center justify-between px-4">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                <img src="https://raw.githubusercontent.com/google/generative-ai-docs/main/site/static/images/frame/logo.svg" alt="Logo" className="h-8 sm:h-12 w-8 sm:w-12 object-contain flex-shrink-0" />
                <div className="overflow-hidden">
                    <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight whitespace-nowrap bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>櫻花之路</h1>
                    <p className="hidden sm:block text-pink-500 text-sm font-semibold">(Sakura no Michi)</p>
                </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                {userProfile && !userProfile.isAnonymous ? (
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-700 hidden sm:block">{userProfile.name.split(' ')[0]}</span>
                        <img 
                            src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${userProfile.name}&background=fbcfe8&color=9d174d`} 
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full cursor-pointer object-cover border-2 border-pink-200" 
                            alt="User Avatar"
                        />
                        <button onClick={onLogoutClick} className="p-2 rounded-full hover:bg-white/50 transition-colors" title="登出">
                            <LogoutIcon />
                        </button>
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="btn-secondary text-sm sm:text-base whitespace-nowrap bg-white text-pink-500 border-2 border-pink-300 hover:bg-pink-500 hover:text-white transition-all duration-300 rounded-lg px-4 py-2 font-semibold">登入</button>
                )}
                <button onClick={onSettingsClick} className="p-2 sm:p-3 rounded-full hover:bg-white/50 transition-colors" title="API 設定">
                    <SettingsIcon />
                </button>
            </div>
        </header>
    );
};

export default Header;
