
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { getAiChatResponse } from '../services/geminiService';

interface AiConversationSectionProps {
    apiKey: string;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
        {children}
    </h2>
);

const AiConversationSection: React.FC<AiConversationSectionProps> = ({ apiKey }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'こんにちは！我是櫻 (Sakura)，你的專屬日語學習夥伴！很高興認識你～ 準備好一起練習日文了嗎？どんなことでも聞いてくださいね！(什麼事都可以問我喔！)' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatDisplayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        if (!apiKey) {
            setMessages(prev => [...prev, { role: 'error', text: '請先在右上角的設定中輸入您的 Gemini API Key。' }]);
            return;
        }

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await getAiChatResponse(apiKey, messages, input);
            setMessages(prev => [...prev, { role: 'model', text: aiResponseText }]);
        } catch (error: any) {
            setMessages(prev => [...prev, { role: 'error', text: `糟糕，對話出錯了：${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section>
            <SectionTitle>AI 櫻花茶館</SectionTitle>
            <div className="bg-white/65 p-4 sm:p-6 rounded-2xl shadow-md border border-white/40 flex flex-col items-center justify-center min-h-[500px]">
                <div ref={chatDisplayRef} className="w-full max-w-3xl h-80 overflow-y-auto p-4 mb-4 border border-pink-200 rounded-lg bg-white/70 shadow-inner space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'error' ? (
                                <div className="p-3 rounded-lg bg-red-100 text-red-700 border border-red-300 w-full break-words shadow text-sm">
                                    {msg.text}
                                </div>
                            ) : (
                                <div className={`p-3 rounded-lg max-w-xs md:max-w-md break-words shadow ${msg.role === 'user' ? 'bg-pink-200 text-gray-800' : 'bg-white text-gray-800'}`}>
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="p-3 rounded-lg bg-white text-gray-800 shadow animate-pulse">
                                 櫻正在思考...
                             </div>
                         </div>
                    )}
                </div>
                <div className="w-full max-w-3xl flex gap-2 sm:gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={apiKey ? "輸入您的日語對話..." : "請先設定 API Key"}
                        disabled={isLoading || !apiKey}
                        className="flex-grow bg-white/50 border border-pink-300 rounded-lg px-4 py-2 text-gray-700 outline-none transition-all duration-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-300 disabled:bg-gray-200"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim() || !apiKey}
                        className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-br from-pink-500 to-rose-400 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                    >
                        {isLoading ? '...' : '發送'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AiConversationSection;
