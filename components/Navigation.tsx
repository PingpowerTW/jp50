
import React from 'react';
import { SectionId } from '../types';

interface NavigationProps {
    activeSection: SectionId;
    setActiveSection: (sectionId: SectionId) => void;
}

const navItems: { id: SectionId; label: string }[] = [
    { id: 'pronunciation-teaching', label: '發音教學' },
    { id: 'phrase-practice', label: '詞句練習' },
    { id: 'ai-conversation', label: 'AI 對話' },
    { id: 'progress-calendar', label: '學習歷程' },
];

const Navigation: React.FC<NavigationProps> = ({ activeSection, setActiveSection }) => {
    return (
        <nav className="w-full max-w-4xl bg-white/55 backdrop-blur-xl border border-white/30 shadow-lg p-3 mb-12 flex flex-wrap justify-center gap-2 sm:gap-4 rounded-3xl">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`px-3 py-2 sm:px-6 sm:py-3 rounded-2xl transition-all duration-300 ease-in-out font-semibold
                        ${activeSection === item.id 
                            ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-lg scale-105' 
                            : 'text-gray-600 bg-white/40 hover:bg-white/80 hover:text-pink-500'}`}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    );
};

export default Navigation;
