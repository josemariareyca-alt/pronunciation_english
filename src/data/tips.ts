export interface Tip {
  id: number;
  title: string;
  rule: string;
  examples: { word: string; phonetic?: string; sentence?: string }[];
  categories?: { name: string; words: string[] }[];
}

export const PRONUNCIATION_TIPS: Tip[] = [
  {
    id: 1,
    title: "Pronunciation of -ED (past tense)",
    rule: "The ending -ed has three possible sounds: /t/, /d/, and /ɪd/.",
    categories: [
      { name: "/t/ (voiceless)", words: ["worked", "laughed", "watched"] },
      { name: "/d/ (voiced)", words: ["played", "cleaned", "called"] },
      { name: "/ɪd/ (after t or d)", words: ["wanted", "needed"] }
    ],
    examples: []
  },
  {
    id: 2,
    title: "“AW” → /ɔː/",
    rule: "This sound is similar to a long “o” sound.",
    examples: [
      { word: "law" },
      { word: "saw" },
      { word: "draw" },
      { word: "awful" }
    ]
  },
  {
    id: 3,
    title: "“GH” → /f/",
    rule: "In some words gh is pronounced /f/. (Usually at the end of the word)",
    examples: [
      { word: "laugh" },
      { word: "cough" },
      { word: "enough" },
      { word: "rough" }
    ]
  },
  {
    id: 4,
    title: "“OUGHT / AUGHT” → /ɔːt/",
    rule: "These combinations usually sound like “ot”.",
    examples: [
      { word: "thought" },
      { word: "bought" },
      { word: "caught" },
      { word: "fought" }
    ]
  },
  {
    id: 5,
    title: "The initial “H” is pronounced",
    rule: "In English the h is aspirated in most cases, but silent in some like 'hour' and 'honor'.",
    categories: [
      { name: "Aspirated", words: ["house", "hotel", "happy", "hospital"] },
      { name: "Silent", words: ["hour", "honor"] }
    ],
    examples: []
  },
  {
    id: 6,
    title: "B vs V (different sounds)",
    rule: "B (both lips together) vs V (top teeth on bottom lip).",
    categories: [
      { name: "B sound", words: ["book", "bad"] },
      { name: "V sound", words: ["very", "move"] }
    ],
    examples: []
  },
  {
    id: 7,
    title: "TH sounds /θ/ and /ð/",
    rule: "/θ/ (voiceless) like 'think' vs /ð/ (voiced) like 'this'.",
    categories: [
      { name: "/θ/ (voiceless)", words: ["think", "thank", "three"] },
      { name: "/ð/ (voiced)", words: ["this", "that", "mother"] }
    ],
    examples: []
  },
  {
    id: 8,
    title: "Short vs long vowels",
    rule: "Vowel length can change the meaning of a word.",
    examples: [
      { word: "ship", phonetic: "/ɪ/" },
      { word: "sheep", phonetic: "/iː/" },
      { word: "full", phonetic: "/ʊ/" },
      { word: "fool", phonetic: "/uː/" },
      { word: "hat", phonetic: "/æ/" },
      { word: "heart", phonetic: "/ɑː/" }
    ]
  },
  {
    id: 9,
    title: "The English “R”",
    rule: "The r sound is softer than the Spanish rolled r. In British English, it's often non-rhotic.",
    examples: [
      { word: "red" },
      { word: "right" },
      { word: "rotten" },
      { word: "car", phonetic: "/kɑː/ (British)" },
      { word: "teacher", phonetic: "/ˈtiːtʃə/ (British)" }
    ]
  },
  {
    id: 10,
    title: "Word stress",
    rule: "English pronunciation depends heavily on stress. Stress can change the word's meaning.",
    examples: [
      { word: "PREsent", phonetic: "(noun)" },
      { word: "preSENT", phonetic: "(verb)" }
    ]
  },
  {
    id: 11,
    title: "“-TION / -SION” → /ʃən/",
    rule: "Words ending in -tion or -sion usually sound like “shun”.",
    examples: [
      { word: "nation" },
      { word: "station" },
      { word: "information" },
      { word: "vision" },
      { word: "decision" }
    ]
  },
  {
    id: 12,
    title: "Silent letters",
    rule: "English has many silent letters that are written but not pronounced.",
    categories: [
      { name: "Silent K", words: ["knife", "know"] },
      { name: "Silent W", words: ["write", "wrong"] },
      { name: "Silent B", words: ["climb", "thumb"] },
      { name: "Silent L", words: ["walk", "talk"] }
    ],
    examples: []
  },
  {
    id: 13,
    title: "Double consonants",
    rule: "Double consonants shorten the vowel before them.",
    examples: [
      { word: "later", phonetic: "/ˈleɪtər/ (long)" },
      { word: "latter", phonetic: "/ˈlætər/ (short)" },
      { word: "diner", phonetic: "/ˈdaɪnər/ (long)" },
      { word: "dinner", phonetic: "/ˈdɪnər/ (short)" }
    ]
  },
  {
    id: 14,
    title: "Different pronunciations of “oo”",
    rule: "The spelling “oo” can represent different vowel sounds: /uː/, /ʊ/, or /ɔː/.",
    categories: [
      { name: "/uː/ (long)", words: ["boot", "food", "moon"] },
      { name: "/ʊ/ (short)", words: ["book", "look", "cook"] },
      { name: "/ɔː/ (other)", words: ["door", "poor"] }
    ],
    examples: []
  },
  {
    id: 15,
    title: "Homophones",
    rule: "Words that have the same pronunciation but different meanings and spellings.",
    examples: [
      { word: "two / too / to" },
      { word: "there / their / they’re" },
      { word: "see / sea" },
      { word: "right / write" }
    ]
  }
];

export const HOMOPHONE_QUIZ = [
  { question: "I went to the beach to see the ___.", options: ["see", "sea"], answer: "sea" },
  { question: "She wrote the answer ___ on the board.", options: ["write", "right"], answer: "right" },
  { question: "They left ___ bags on the chair.", options: ["their", "there", "they're"], answer: "their" },
  { question: "I ate ___ pieces of cake.", options: ["two", "too", "to"], answer: "two" },
  { question: "The ___ is very bright today.", options: ["sun", "son"], answer: "sun" },
  { question: "The knight rode his ___ through the forest.", options: ["horse", "hoarse"], answer: "horse" },
  { question: "The ___ in the garden smells nice.", options: ["flour", "flower"], answer: "flower" },
  { question: "The dog wagged its ___ happily.", options: ["tail", "tale"], answer: "tail" },
  { question: "I ___ the answer to the question.", options: ["knew", "new"], answer: "knew" },
  { question: "Please ___ me at the café.", options: ["meet", "meat"], answer: "meet" }
];

export const FILL_BLANKS_EXERCISES = [
  { question: "He work___ (past tense) all day.", answer: "ed", hint: "Sound: /t/", full: "worked" },
  { question: "I want___ (past tense) to go home.", answer: "ed", hint: "Sound: /ɪd/", full: "wanted" },
  { question: "She play___ (past tense) the piano.", answer: "ed", hint: "Sound: /d/", full: "played" },
  { question: "I ___now (silent letter) the answer.", answer: "k", hint: "Silent letter at the start", full: "know" },
  { question: "Please ___rite (silent letter) your name.", answer: "w", hint: "Silent letter at the start", full: "write" },
  { question: "It's a high mountain to clim___ (silent letter).", answer: "b", hint: "Silent letter at the end", full: "climb" },
  { question: "I need a ___nife (silent letter) to cut the bread.", answer: "k", hint: "Silent letter at the start", full: "knife" },
  { question: "Let's go for a wal___ (silent letter).", answer: "k", hint: "Silent letter at the end", full: "walk" }
];

export const FLASHCARDS_DATA = [
  { front: "worked", back: "/t/ sound", category: "-ED Ending" },
  { front: "played", back: "/d/ sound", category: "-ED Ending" },
  { front: "wanted", back: "/ɪd/ sound", category: "-ED Ending" },
  { front: "know", back: "Silent K", category: "Silent Letters" },
  { front: "climb", back: "Silent B", category: "Silent Letters" },
  { front: "ship", back: "Short /ɪ/", category: "Vowels" },
  { front: "sheep", back: "Long /iː/", category: "Vowels" },
  { front: "thought", back: "/ɔːt/ sound", category: "OUGHT/AUGHT" },
  { front: "laugh", back: "/f/ sound", category: "GH" },
  { front: "nation", back: "/ʃən/ sound", category: "-TION" }
];
