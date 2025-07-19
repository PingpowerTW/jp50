
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserProfile, HiraganaCharacter } from '../types';

interface ProgressSectionProps {
    userProfile: UserProfile | null;
    hiraganaData: HiraganaCharacter[];
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
        {children}
    </h2>
);

const SakuraCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-white/65 p-6 text-center flex flex-col rounded-2xl shadow-md border border-white/40 ${className || ''}`}>
        {children}
    </div>
);

const Calendar: React.FC<{ studyRecords: string[] }> = ({ studyRecords }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return (
        <SakuraCard className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">學習日曆</h3>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-pink-100 transition-colors">&lt;</button>
                <h4 className="text-xl font-semibold text-pink-600">{year}年 {month + 1}月</h4>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-pink-100 transition-colors">&gt;</button>
            </div>
            <div className="grid grid-cols-7 text-center font-bold text-gray-600 mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map(day => <span key={day}>{day}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
                    const isStudied = studyRecords.includes(dateStr);
                    return (
                        <div key={day} className={`aspect-square flex items-center justify-center rounded-lg transition-all duration-200 ${isStudied ? 'bg-gradient-to-br from-pink-400 to-rose-300 text-white font-bold shadow-md' : 'bg-gray-200/50'}`}>
                            {day + 1}
                        </div>
                    );
                })}
            </div>
        </SakuraCard>
    );
};

const ProficiencyChart: React.FC<{ hiraganaData: HiraganaCharacter[] }> = ({ hiraganaData }) => {
    const chartData = useMemo(() => {
        const levels = [
            { name: '未學習', value: 0 },
            { name: '初識', value: 0 },
            { name: '入門', value: 0 },
            { name: '熟悉', value: 0 },
            { name: '熟練', value: 0 },
            { name: '精通', value: 0 },
        ];
        hiraganaData.forEach(item => {
            levels[item.proficiency].value++;
        });
        return levels.filter(l => l.value > 0);
    }, [hiraganaData]);

    const COLORS = ['#e5e7eb', '#fbcfe8', '#f9a8d4', '#f472b6', '#6ee7b7', '#34d399'];

    return (
        <SakuraCard>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">五十音熟練度</h3>
            <div className="w-full h-64">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[levels.findIndex(l => l.name === entry.name)]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </SakuraCard>
    );
};

const ProgressSection: React.FC<ProgressSectionProps> = ({ userProfile, hiraganaData }) => {
    return (
        <section>
            <SectionTitle>我的學習歷程</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Calendar studyRecords={userProfile?.studyRecords || []} />
                <ProficiencyChart hiraganaData={hiraganaData} />
            </div>
        </section>
    );
};

const levels = [
    { name: '未學習' }, { name: '初識' }, { name: '入門' },
    { name: '熟悉' }, { name: '熟練' }, { name: '精通' }
];

export default ProgressSection;
