import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HiraganaCharacter, GameId, CrosswordPuzzle, CellInfo } from '../types';
import { HIRAGANA_DATA } from '../constants';
import { CROSSWORD_PUZZLE as puzzleData } from '../constants';

interface PracticeSectionProps {
    hiraganaData: HiraganaCharacter[];
    playSound: (text: string) => void;
}

// Sound effects helper
const playAudio = (soundUrl: string) => {
    try {
        const audio = new Audio(soundUrl);
        audio.volume = 0.4; // Adjust volume to be pleasant
        audio.play().catch(e => console.error("Error playing sound:", e));
    } catch (e) {
        console.error("Could not play audio:", e);
    }
};

const SOUNDS = {
    CORRECT: 'https://actions.google.com/sounds/v1/positive/bell_tree_up.ogg',
    INCORRECT: 'https://actions.google.com/sounds/v1/alarms/buzzy_alarm.ogg',
    START: 'https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg',
    GAMEOVER: 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg'
};


const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
        {children}
    </h2>
);

const SakuraCard: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className, onClick }) => (
    <div 
        className={`bg-white/65 p-6 text-center flex flex-col rounded-2xl shadow-md border border-white/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-pink-500/20 ${className || ''}`}
        onClick={onClick}
    >
        {children}
    </div>
);

const PrimaryButton: React.FC<{ children: React.ReactNode, onClick: () => void, disabled?: boolean, className?: string }> = ({ children, onClick, disabled, className }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-br from-pink-500 to-rose-400 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed ${className || ''}`}
    >
        {children}
    </button>
);

const SecondaryButton: React.FC<{ children: React.ReactNode, onClick: () => void, className?: string }> = ({ children, onClick, className }) => (
    <button 
        onClick={onClick}
        className={`px-6 py-3 rounded-lg font-semibold bg-white text-pink-500 border-2 border-pink-300 hover:bg-pink-500 hover:text-white transition-all duration-300 ${className || ''}`}
    >
        {children}
    </button>
);

const PracticeMenu: React.FC<{ onSelectGame: (gameId: GameId) => void }> = ({ onSelectGame }) => (
    <div>
        <SectionTitle>詞句練習</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SakuraCard>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">每日練習卡</h3>
                <p className="text-gray-600 mb-6 flex-grow">每日一卡，輕鬆鞏固您的日語基礎！</p>
                <SecondaryButton onClick={() => onSelectGame('daily-practice')} className="mt-auto">開始練習</SecondaryButton>
            </SakuraCard>
            <SakuraCard>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">櫻花單字配對</h3>
                <p className="text-gray-600 mb-6 flex-grow">計時挑戰！在飛舞的櫻花中選出正確讀音。</p>
                <SecondaryButton onClick={() => onSelectGame('word-match-game')} className="mt-auto">開始遊戲</SecondaryButton>
            </SakuraCard>
            <SakuraCard>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">和風填字</h3>
                <p className="text-gray-600 mb-6 flex-grow">挑戰你的詞彙量，完成日式填字謎題。</p>
                <SecondaryButton onClick={() => onSelectGame('crossword-game')} className="mt-auto">開始遊戲</SecondaryButton>
            </SakuraCard>
        </div>
    </div>
);

const DailyPractice: React.FC<{ onBack: () => void; playSound: (text: string) => void }> = ({ onBack, playSound }) => {
    const [card, setCard] = useState<HiraganaCharacter>({ ...HIRAGANA_DATA[0], proficiency: 0 });

    const newCard = useCallback(() => {
        const randomCard = HIRAGANA_DATA[Math.floor(Math.random() * HIRAGANA_DATA.length)];
        setCard({ ...randomCard, proficiency: 0 });
    }, []);

    useEffect(() => {
        newCard();
    }, [newCard]);

    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-pink-600 mb-6">每日練習卡</h2>
            <SakuraCard className="max-w-md mx-auto p-8 min-h-[350px] flex flex-col justify-center items-center">
                <div className="text-8xl font-bold text-gray-800 cursor-pointer" style={{fontFamily: "'Noto Sans JP', sans-serif"}} onClick={() => playSound(card.hiragana)}>
                    {card.hiragana}
                </div>
                <div className="mt-4 text-3xl text-gray-700">{card.romaji}</div>
                <p className="mt-2 text-xl text-gray-600">{card.word}</p>
            </SakuraCard>
            <div className="mt-6 flex justify-center gap-4">
                <SecondaryButton onClick={onBack}>返回選單</SecondaryButton>
                <PrimaryButton onClick={newCard}>下一張</PrimaryButton>
            </div>
        </div>
    );
};

const WordMatchGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [timer, setTimer] = useState(30);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [question, setQuestion] = useState<HiraganaCharacter | null>(null);
    const [options, setOptions] = useState<HiraganaCharacter[]>([]);
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    
    const generateNewQuestion = useCallback(() => {
        setIsCorrect(null);
        setFeedback('');
        const shuffled = [...HIRAGANA_DATA].sort(() => 0.5 - Math.random());
        const questionItem = shuffled[0];
        const wrongOptions = shuffled.slice(1, 4);
        const allOptions = [questionItem, ...wrongOptions].sort(() => 0.5 - Math.random());
        
        setQuestion({ ...questionItem, proficiency: 0 });
        setOptions(allOptions.map(opt => ({ ...opt, proficiency: 0 })));
    }, []);

    useEffect(() => {
        if (!isGameOver) {
            playAudio(SOUNDS.START);
            generateNewQuestion();
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsGameOver(true);
                        playAudio(SOUNDS.GAMEOVER);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isGameOver, generateNewQuestion]);

    const handleAnswer = (selectedRomaji: string) => {
        if (isCorrect !== null) return;
        
        if (selectedRomaji === question?.romaji) {
            playAudio(SOUNDS.CORRECT);
            setScore(s => s + 1);
            setFeedback('正確！');
            setIsCorrect(true);
        } else {
            playAudio(SOUNDS.INCORRECT);
            setFeedback(`錯誤！答案是 ${question?.romaji}`);
            setIsCorrect(false);
        }

        setTimeout(() => {
            if (timer > 0) generateNewQuestion();
        }, 1200);
    };
    
    const restartGame = () => {
        setTimer(30);
        setScore(0);
        setIsGameOver(false);
    };

    return (
        <div>
            <SectionTitle>櫻花單字配對</SectionTitle>
            <div className="flex justify-between items-center max-w-lg mx-auto mb-4 text-xl font-bold text-gray-700">
                <div>時間: <span className="text-pink-500 w-8 inline-block">{timer}</span>s</div>
                <div>得分: <span className="text-pink-500">{score}</span></div>
            </div>
            <SakuraCard className="max-w-lg mx-auto p-8">
                {isGameOver ? (
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-pink-600 mb-4">時間到！</h3>
                        <p className="text-xl text-gray-700">您的最終得分是：</p>
                        <p className="text-6xl font-bold text-fuchsia-700 my-4">{score}</p>
                        <PrimaryButton onClick={restartGame}>再玩一次</PrimaryButton>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-2xl text-gray-600 mb-4">請選擇「<span className="font-bold text-fuchsia-700 text-3xl" style={{fontFamily: "'Noto Sans JP', sans-serif"}}>{question?.hiragana}</span>」的正確讀音：</p>
                        <div className="grid grid-cols-2 gap-4 my-6">
                            {options.map(opt => (
                                <button
                                    key={opt.romaji}
                                    onClick={() => handleAnswer(opt.romaji)}
                                    disabled={isCorrect !== null}
                                    className={`p-4 rounded-lg text-xl font-bold border-2 transition-all duration-200 
                                    ${isCorrect !== null && opt.romaji === question?.romaji ? 'bg-green-200 border-green-400 scale-105' 
                                    : isCorrect !== null && opt.romaji !== question?.romaji ? 'bg-red-200 border-red-400' 
                                    : 'bg-white border-pink-200 hover:bg-pink-100 hover:scale-105'}`}
                                >
                                    {opt.romaji}
                                </button>
                            ))}
                        </div>
                        <div className={`mt-4 h-6 text-lg font-bold ${isCorrect === true ? 'text-green-600' : 'text-red-600'}`}>
                            {feedback}
                        </div>
                    </div>
                )}
            </SakuraCard>
             <div className="mt-6 text-center">
                <SecondaryButton onClick={onBack}>返回選單</SecondaryButton>
            </div>
        </div>
    );
};

const CrosswordGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [grid, setGrid] = useState<string[][]>([]);
    const [activeClue, setActiveClue] = useState<{ id: number; dir: 'H' | 'V' } | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
    
    useEffect(() => {
        const newGrid = Array(puzzleData.height).fill(null).map(() => Array(puzzleData.width).fill(''));
        setGrid(newGrid);
        inputRefs.current = Array(puzzleData.height).fill(null).map(() => Array(puzzleData.width).fill(null));
    }, []);

    const isCellPartOfPuzzle = (r: number, c: number) => puzzleData.clues.some(clue => {
        if (clue.dir === 'H') return r === clue.row && c >= clue.col && c < clue.col + clue.word.length;
        if (clue.dir === 'V') return c === clue.col && r >= clue.row && r < clue.row + clue.word.length;
        return false;
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, r: number, c: number) => {
        const value = e.target.value.toUpperCase();
        const newGrid = [...grid];
        newGrid[r][c] = value;
        setGrid(newGrid);

        if (value && activeClue) {
            let nextR = r, nextC = c;
            if (activeClue.dir === 'H') nextC++; else nextR++;
            if (nextR < puzzleData.height && nextC < puzzleData.width && inputRefs.current[nextR][nextC]) {
                inputRefs.current[nextR][nextC]?.focus();
            }
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
        let nextR = r, nextC = c;
        if (e.key === 'ArrowUp') { e.preventDefault(); nextR--; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); nextR++; }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); nextC--; }
        else if (e.key === 'ArrowRight') { e.preventDefault(); nextC++; }
        else if (e.key === 'Backspace' && !grid[r][c]) {
            e.preventDefault();
            if (activeClue?.dir === 'H') nextC--; else nextR--;
        }

        if ((nextR !== r || nextC !== c) && nextR >= 0 && nextR < puzzleData.height && nextC >= 0 && nextC < puzzleData.width && inputRefs.current[nextR][nextC]) {
            inputRefs.current[nextR][nextC]?.focus();
        }
    };
    
    const handleFocus = (r: number, c: number) => {
        const newActiveClue = puzzleData.clues.find(clue => {
            if (activeClue?.dir === 'H') {
                return clue.dir === 'H' && clue.row === r && c >= clue.col && c < clue.col + clue.word.length;
            }
            if(activeClue?.dir === 'V') {
                return clue.dir === 'V' && clue.col === c && r >= clue.row && r < clue.row + clue.word.length;
            }
            return false;
        }) || puzzleData.clues.find(clue => 
            (clue.dir === 'H' && clue.row === r && c >= clue.col && c < clue.col + clue.word.length) ||
            (clue.dir === 'V' && clue.col === c && r >= clue.row && r < clue.row + clue.word.length)
        );
        if (newActiveClue) {
            setActiveClue({ id: newActiveClue.id, dir: newActiveClue.dir });
        }
    };

    const checkAnswers = () => {
        let allCorrect = true;
        puzzleData.clues.forEach(clue => {
            for (let i = 0; i < clue.word.length; i++) {
                const r = clue.dir === 'V' ? clue.row + i : clue.row;
                const c = clue.dir === 'H' ? clue.col + i : clue.col;
                const input = inputRefs.current[r][c];
                if (input) {
                    const expected = clue.word[i].toUpperCase();
                    if (input.value !== expected) {
                        allCorrect = false;
                        input.classList.add('bg-red-200', 'border-red-400');
                        input.classList.remove('bg-green-200', 'border-green-400');
                    } else {
                        input.classList.add('bg-green-200', 'border-green-400');
                        input.classList.remove('bg-red-200', 'border-red-400');
                    }
                }
            }
        });
        alert(allCorrect ? "恭喜，全部正確！" : "有些答案不對喔，看看那些紅色的格子吧！");
    };

    return (
        <div>
            <SectionTitle>和風填字</SectionTitle>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <SakuraCard className="flex-grow flex justify-center p-4 sm:p-6">
                    <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${puzzleData.width}, minmax(0, 1fr))`}}>
                        {Array.from({ length: puzzleData.height }).map((_, r) => (
                            Array.from({ length: puzzleData.width }).map((_, c) => {
                                if (!isCellPartOfPuzzle(r, c)) {
                                    return <div key={`${r}-${c}`} className="w-8 h-8 sm:w-10 sm:h-10"></div>;
                                }
                                const clueStart = puzzleData.clues.find(clue => clue.row === r && clue.col === c);
                                const isHighlighted = activeClue && puzzleData.clues.some(clue => 
                                    clue.id === activeClue.id && (
                                        (clue.dir === 'H' && clue.row === r && c >= clue.col && c < clue.col + clue.word.length) ||
                                        (clue.dir === 'V' && clue.col === c && r >= clue.row && r < clue.row + clue.word.length)
                                    )
                                );
                                return (
                                    <div key={`${r}-${c}`} className="relative w-8 h-8 sm:w-10 sm:h-10">
                                        {clueStart && <span className="absolute top-0 left-0.5 text-xs font-bold text-purple-600">{clueStart.id}</span>}
                                        <input
                                            ref={el => { if(inputRefs.current[r]) inputRefs.current[r][c] = el; }}
                                            type="text"
                                            maxLength={1}
                                            value={grid[r]?.[c] || ''}
                                            onChange={(e) => handleInputChange(e, r, c)}
                                            onKeyDown={(e) => handleKeyDown(e, r, c)}
                                            onFocus={() => handleFocus(r, c)}
                                            className={`w-full h-full text-center sm:text-lg font-bold border rounded caret-pink-500 uppercase transition-colors
                                            ${isHighlighted ? 'bg-pink-100 border-pink-400' : 'bg-white border-pink-200'}
                                            focus:outline-none focus:ring-2 focus:ring-pink-500 focus:z-10`}
                                            style={{fontFamily: "'Noto Sans JP', sans-serif"}}
                                        />
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </SakuraCard>
                <SakuraCard className="lg:w-1/3 w-full">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">提示</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto text-left">
                        {puzzleData.clues.map(clue => (
                            <div 
                                key={`${clue.dir}-${clue.id}`} 
                                onClick={() => {
                                    setActiveClue({ id: clue.id, dir: clue.dir });
                                    inputRefs.current[clue.row][clue.col]?.focus();
                                }}
                                className={`p-2 rounded-md cursor-pointer transition-colors ${activeClue?.id === clue.id ? 'bg-pink-200' : 'hover:bg-pink-100'}`}
                            >
                                {clue.id}. {clue.clue} ({clue.dir === 'H' ? '橫' : '直'})
                            </div>
                        ))}
                    </div>
                    <PrimaryButton onClick={checkAnswers} className="w-full mt-6">檢查答案</PrimaryButton>
                    <SecondaryButton onClick={onBack} className="w-full mt-3">返回選單</SecondaryButton>
                </SakuraCard>
            </div>
        </div>
    );
};

const PracticeSection: React.FC<PracticeSectionProps> = ({ hiraganaData, playSound }) => {
    const [activeGame, setActiveGame] = useState<GameId>('menu');

    const renderGame = () => {
        switch (activeGame) {
            case 'daily-practice':
                return <DailyPractice onBack={() => setActiveGame('menu')} playSound={playSound} />;
            case 'word-match-game':
                return <WordMatchGame onBack={() => setActiveGame('menu')} />;
            case 'crossword-game':
                return <CrosswordGame onBack={() => setActiveGame('menu')} />;
            case 'menu':
            default:
                return <PracticeMenu onSelectGame={setActiveGame} />;
        }
    };

    return <section>{renderGame()}</section>;
};

export default PracticeSection;