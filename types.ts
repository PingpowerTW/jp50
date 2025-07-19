
export interface HiraganaCharacter {
  hiragana: string;
  romaji: string;
  word: string;
  proficiency: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  progress: { [key: string]: number };
  studyRecords: string[];
}

export type SectionId = 'pronunciation-teaching' | 'phrase-practice' | 'ai-conversation' | 'progress-calendar';

export type GameId = 'menu' | 'daily-practice' | 'word-match-game' | 'crossword-game';

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  text: string;
}

export interface CrosswordClue {
  id: number;
  dir: 'H' | 'V';
  row: number;
  col: number;
  word: string;
  clue: string;
}

export interface CrosswordPuzzle {
  width: number;
  height: number;
  clues: CrosswordClue[];
}

export interface CellInfo {
  container: HTMLDivElement | null;
  input: HTMLInputElement | null;
  clues: { [key: string]: number };
  answerH?: string;
  answerV?: string;
}
