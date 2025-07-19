
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MainContent from './components/MainContent';
import { SectionId, UserProfile, HiraganaCharacter } from './types';
import { HIRAGANA_DATA } from './constants';

// Mock Firebase for demonstration. In a real app, you would use the actual SDK.
const mockAuth = {
    onAuthStateChanged: (callback: (user: any) => void) => {
        setTimeout(() => callback({ uid: 'anonymous123', isAnonymous: true, displayName: '訪客' }), 1000);
        return () => {}; // Unsubscribe function
    },
    signInWithGoogle: () => alert("Google 登入功能正在開發中！"),
    signOut: () => window.location.reload(),
};

const mockDb = {
    getUserProfile: async (uid: string): Promise<UserProfile | null> => {
        if (uid === 'anonymous123') return null; // No profile for anon
        console.log(`Fetching profile for ${uid}`);
        return null; // Mock: no user found
    },
    updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
        if (uid === 'anonymous123') return;
        console.log(`Updating profile for ${uid}:`, data);
    }
};

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<SectionId>('pronunciation-teaching');
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [hiraganaData, setHiraganaData] = useState<HiraganaCharacter[]>([]);
    const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('geminiApiKey') || '');

    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);

    // --- Sound Synthesis ---
    const playSound = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ja-JP';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }, []);
    
    useEffect(() => {
        const warmUpSpeech = () => {
            if ('speechSynthesis' in window && window.speechSynthesis.getVoices().length === 0) {
                 window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
            }
        };
        document.body.addEventListener('click', warmUpSpeech, { once: true });
        document.body.addEventListener('touchend', warmUpSpeech, { once: true });
        return () => {
             document.body.removeEventListener('click', warmUpSpeech);
             document.body.removeEventListener('touchend', warmUpSpeech);
        }
    }, []);
    
    // --- Auth & Data Loading ---
    useEffect(() => {
        const unsubscribe = mockAuth.onAuthStateChanged(async (user) => {
            if (user) {
                let profile = await mockDb.getUserProfile(user.uid);
                if (!profile) {
                     profile = {
                        uid: user.uid,
                        name: user.displayName || '訪客',
                        email: user.email || null,
                        photoURL: user.photoURL || null,
                        isAnonymous: user.isAnonymous,
                        progress: {},
                        studyRecords: [],
                    };
                }
                setUserProfile(profile);
                 const loadedHiragana = HIRAGANA_DATA.map(h => ({
                    ...h,
                    proficiency: profile?.progress[h.hiragana] || 0
                }));
                setHiraganaData(loadedHiragana);

            } else {
                setUserProfile(null);
                setHiraganaData(HIRAGANA_DATA.map(h => ({ ...h, proficiency: 0 })));
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const updateUserProgress = useCallback((character: string, newProficiency: number) => {
        if (!userProfile) return;

        setHiraganaData(prevData => {
            const newData = prevData.map(item =>
                item.hiragana === character ? { ...item, proficiency: newProficiency } : item
            );
            return newData;
        });

        const today = new Date().toISOString().split('T')[0];
        setUserProfile(prevProfile => {
            if (!prevProfile) return null;
            const updatedProfile = { ...prevProfile };
            updatedProfile.progress[character] = newProficiency;
            if (!updatedProfile.studyRecords.includes(today)) {
                updatedProfile.studyRecords.push(today);
            }
            mockDb.updateUserProfile(updatedProfile.uid, { progress: updatedProfile.progress, studyRecords: updatedProfile.studyRecords });
            return updatedProfile;
        });
    }, [userProfile]);
    
    const handleApiKeySave = (key: string) => {
        setGeminiApiKey(key);
        localStorage.setItem('geminiApiKey', key);
        setSettingsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h2 className="text-2xl font-semibold text-pink-500 animate-pulse">資料載入中，請稍候...</h2>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
            <Header 
                userProfile={userProfile}
                onLoginClick={() => setLoginModalOpen(true)}
                onLogoutClick={() => mockAuth.signOut()}
                onSettingsClick={() => setSettingsModalOpen(true)}
            />
            <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
            <MainContent
                activeSection={activeSection}
                userProfile={userProfile}
                hiraganaData={hiraganaData}
                geminiApiKey={geminiApiKey}
                updateUserProgress={updateUserProgress}
                playSound={playSound}
            />
            <footer className="w-full max-w-6xl text-center mt-12 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} 櫻花之路 2.0 - A Generative AI Project
            </footer>

            {isSettingsModalOpen && <SettingsModal onClose={() => setSettingsModalOpen(false)} onSave={handleApiKeySave} currentKey={geminiApiKey} />}
            {isLoginModalOpen && <LoginModal onClose={() => setLoginModalOpen(false)} onGoogleLogin={() => mockAuth.signInWithGoogle()} />}
        </div>
    );
};

// --- Modals ---
const Modal: React.FC<{ children: React.ReactNode; onClose: () => void; title: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
        <div className="bg-white/55 backdrop-blur-xl border border-white/30 shadow-xl p-6 sm:p-8 max-w-md w-full relative rounded-3xl m-4" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-600 hover:text-pink-500 text-3xl font-light" onClick={onClose}>&times;</button>
            <h2 className="text-3xl mb-6 text-center font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>{title}</h2>
            {children}
        </div>
    </div>
);

const SettingsModal: React.FC<{ onClose: () => void; onSave: (key: string) => void; currentKey: string }> = ({ onClose, onSave, currentKey }) => {
    const [key, setKey] = useState(currentKey);
    return (
        <Modal onClose={onClose} title="Gemini API 設定">
            <p className="text-gray-700 mb-6 text-center">請輸入您的 Gemini API Key 以啟用 AI 對話功能。</p>
            <div className="mb-4">
                <label htmlFor="gemini-api-key" className="block text-gray-700 text-sm font-bold mb-2">Gemini API Key:</label>
                <input type="password" id="gemini-api-key" value={key} onChange={e => setKey(e.target.value)} className="w-full bg-white/50 border border-pink-300 rounded-lg px-4 py-2 text-gray-700 outline-none transition-all duration-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-300" placeholder="在此輸入您的 API Key" />
            </div>
            <div className="flex gap-4 justify-center mb-4">
                <button onClick={() => onSave(key)} className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-br from-pink-500 to-rose-400 shadow-md">儲存</button>
                <button onClick={onClose} className="px-6 py-2 rounded-lg font-semibold bg-white text-pink-500 border-2 border-pink-300">取消</button>
            </div>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700 text-center block">如何取得 API Key？</a>
        </Modal>
    );
};

const LoginModal: React.FC<{ onClose: () => void; onGoogleLogin: () => void }> = ({ onClose, onGoogleLogin }) => (
    <Modal onClose={onClose} title="登入櫻花之路">
        <p className="text-gray-700 mb-8 text-center">登入以同步您的學習進度！</p>
        <button onClick={onGoogleLogin} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-br from-pink-500 to-rose-400 shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
            使用 Google 登入
        </button>
    </Modal>
);

export default App;
