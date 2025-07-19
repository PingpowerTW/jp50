
import { HiraganaCharacter, CrosswordPuzzle } from './types';

export const HIRAGANA_DATA: Omit<HiraganaCharacter, 'proficiency'>[] = [
  { hiragana: 'あ', romaji: 'a', word: '朝 (asa)' }, { hiragana: 'い', romaji: 'i', word: '犬 (inu)' },
  { hiragana: 'う', romaji: 'u', word: '海 (umi)' }, { hiragana: 'え', romaji: 'e', word: '駅 (eki)' },
  { hiragana: 'お', romaji: 'o', word: 'お金 (okane)' }, { hiragana: 'か', romaji: 'ka', word: '傘 (kasa)' },
  { hiragana: 'き', romaji: 'ki', word: '木 (ki)' }, { hiragana: 'く', romaji: 'ku', word: '靴 (kutsu)' },
  { hiragana: 'け', romaji: 'ke', word: 'ケーキ (keeki)' }, { hiragana: 'こ', romaji: 'ko', word: '子供 (kodomo)' },
  { hiragana: 'さ', romaji: 'sa', word: '魚 (sakana)' }, { hiragana: 'し', romaji: 'shi', word: '写真 (shashin)' },
  { hiragana: 'す', romaji: 'su', word: '寿司 (sushi)' }, { hiragana: 'せ', romaji: 'se', word: '世界 (sekai)' },
  { hiragana: 'そ', romaji: 'so', word: '空 (sora)' }, { hiragana: 'た', romaji: 'ta', word: '卵 (tamago)' },
  { hiragana: 'ち', romaji: 'chi', word: '地下鉄 (chikatetsu)' }, { hiragana: 'つ', romaji: 'tsu', word: '机 (tsukue)' },
  { hiragana: 'て', romaji: 'te', word: '手紙 (tegami)' }, { hiragana: 'と', romaji: 'to', word: '時計 (tokei)' },
  { hiragana: 'な', romaji: 'na', word: '名前 (namae)' }, { hiragana: 'に', romaji: 'ni', word: '日本語 (nihongo)' },
  { hiragana: 'ぬ', romaji: 'nu', word: '布 (nuno)' }, { hiragana: 'ね', romaji: 'ne', word: '猫 (neko)' },
  { hiragana: 'の', romaji: 'no', word: '喉 (nodo)' }, { hiragana: 'は', romaji: 'ha', word: '花 (hana)' },
  { hiragana: 'ひ', romaji: 'hi', word: '飛行機 (hikouki)' }, { hiragana: 'ふ', romaji: 'fu', word: '富士山 (fujisan)' },
  { hiragana: 'へ', romaji: 'he', word: '部屋 (heya)' }, { hiragana: 'ほ', romaji: 'ho', word: '本 (hon)' },
  { hiragana: 'ま', romaji: 'ma', word: '毎日 (mainichi)' }, { hiragana: 'み', romaji: 'mi', word: '水 (mizu)' },
  { hiragana: 'む', romaji: 'mu', word: '虫 (mushi)' }, { hiragana: 'め', romaji: 'me', word: '眼鏡 (megane)' },
  { hiragana: 'も', romaji: 'mo', word: '桃 (momo)' }, { hiragana: 'や', romaji: 'ya', word: '山 (yama)' },
  { hiragana: 'ゆ', romaji: 'yu', word: '雪 (yuki)' }, { hiragana: 'よ', romaji: 'yo', word: '夜 (yoru)' },
  { hiragana: 'ら', romaji: 'ra', word: 'ラーメン (raamen)' }, { hiragana: 'り', romaji: 'ri', word: 'りんご (ringo)' },
  { hiragana: 'る', romaji: 'ru', word: '留守 (rusu)' }, { hiragana: 'れ', romaji: 're', word: '歴史 (rekishi)' },
  { hiragana: 'ろ', romaji: 'ro', word: 'ろうそく (rousoku)' }, { hiragana: 'わ', romaji: 'wa', word: '私 (watashi)' },
  { hiragana: 'を', romaji: 'wo', word: '〜を (助詞)' }, { hiragana: 'ん', romaji: 'n', word: '新聞 (shinbun)' },
];

export const CROSSWORD_PUZZLE: CrosswordPuzzle = {
    width: 5, height: 5,
    clues: [
        { id: 1, dir: 'H', row: 0, col: 1, word: 'ねこ', clue: '會喵喵叫的動物' },
        { id: 2, dir: 'V', row: 0, col: 1, word: 'なつ', clue: '夏天' },
        { id: 3, dir: 'H', row: 2, col: 0, word: 'さかな', clue: '在水裡游的' },
        { id: 4, dir: 'V', row: 2, col: 4, word: 'なまえ', clue: '你的...？ (Your Name)' },
        { id: 5, dir: 'H', row: 4, col: 1, word: 'いぬ', clue: '人類最好的朋友' },
    ]
};
