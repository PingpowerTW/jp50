
import React from 'react';
import { HiraganaCharacter } from '../types';

interface PronunciationSectionProps {
    hiraganaData: HiraganaCharacter[];
    updateUserProgress: (character: string, newProficiency: number) => void;
    playSound: (text: string) => void;
}

const ProficiencyBadge: React.FC<{ proficiency: number }> = ({ proficiency }) => {
    const proficiencyColors = [
        'bg-gray-200/80', 
        'bg-pink-200/80', 
        'bg-pink-300/80', 
        'bg-yellow-200/80', 
        'bg-green-200/80', 
        'bg-gradient-to-br from-green-300/80 to-blue-300/80'
    ];
    const proficiencyText = ['未學習', '初識', '入門', '熟悉', '熟練', '精通'];

    return (
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold text-gray-700 ${proficiencyColors[proficiency]}`}>
            {proficiencyText[proficiency]}
        </div>
    );
};

const HiraganaCard: React.FC<{ item: HiraganaCharacter; onCardClick: () => void }> = ({ item, onCardClick }) => {
    const proficiencyColors = [
        'bg-white/60', 
        'bg-pink-100', 
        'bg-pink-200', 
        'bg-yellow-100', 
        'bg-green-100', 
        'bg-gradient-to-br from-green-200 to-blue-200'
    ];

    return (
        <div
            className={`relative p-4 text-center flex flex-col items-center justify-between cursor-pointer rounded-2xl shadow-md border border-white/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${proficiencyColors[item.proficiency]}`}
            onClick={onCardClick}
        >
            <div className="text-6xl font-bold text-gray-800" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                {item.hiragana}
            </div>
            <div className="text-xl text-gray-700">{item.romaji}</div>
            <div className="text-sm text-gray-600 mt-2">例: {item.word}</div>
            <ProficiencyBadge proficiency={item.proficiency} />
        </div>
    );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
        {children}
    </h2>
);

const PronunciationSection: React.FC<PronunciationSectionProps> = ({ hiraganaData, updateUserProgress, playSound }) => {
    const handleCardClick = (item: HiraganaCharacter) => {
        playSound(item.hiragana);
        const newProficiency = item.proficiency < 5 ? item.proficiency + 1 : 5;
        updateUserProgress(item.hiragana, newProficiency);
    };
    
    return (
        <section>
            <SectionTitle>五十音發音教學</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {hiraganaData.map(item => (
                    <HiraganaCard 
                        key={item.hiragana} 
                        item={item} 
                        onCardClick={() => handleCardClick(item)} 
                    />
                ))}
            </div>
        </section>
    );
};

export default PronunciationSection;
