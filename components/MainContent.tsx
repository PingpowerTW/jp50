
import React from 'react';
import { SectionId, UserProfile, HiraganaCharacter } from '../types';
import PronunciationSection from './PronunciationSection';
import PracticeSection from './PracticeSection';
import AiConversationSection from './AiConversationSection';
import ProgressSection from './ProgressSection';

interface MainContentProps {
    activeSection: SectionId;
    userProfile: UserProfile | null;
    hiraganaData: HiraganaCharacter[];
    geminiApiKey: string;
    updateUserProgress: (character: string, newProficiency: number) => void;
    playSound: (text: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
    activeSection, 
    userProfile, 
    hiraganaData, 
    geminiApiKey,
    updateUserProgress,
    playSound
}) => {
    return (
        <main className="w-full max-w-6xl bg-white/55 backdrop-blur-xl border border-white/30 shadow-xl p-4 sm:p-6 md:p-8 rounded-3xl min-h-[500px]">
            {activeSection === 'pronunciation-teaching' && (
                <PronunciationSection 
                    hiraganaData={hiraganaData} 
                    updateUserProgress={updateUserProgress} 
                    playSound={playSound}
                />
            )}
            {activeSection === 'phrase-practice' && (
                <PracticeSection 
                    hiraganaData={hiraganaData}
                    playSound={playSound}
                />
            )}
            {activeSection === 'ai-conversation' && (
                <AiConversationSection apiKey={geminiApiKey} />
            )}
            {activeSection === 'progress-calendar' && (
                <ProgressSection userProfile={userProfile} hiraganaData={hiraganaData} />
            )}
        </main>
    );
};

export default MainContent;
