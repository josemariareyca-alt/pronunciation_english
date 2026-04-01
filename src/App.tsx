import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  Trophy,
  GraduationCap,
  Sparkles,
  Search,
  RotateCcw,
  Layers,
  Type
} from 'lucide-react';
import { 
  PRONUNCIATION_TIPS, 
  HOMOPHONE_QUIZ, 
  FILL_BLANKS_EXERCISES, 
  FLASHCARDS_DATA, 
  Tip 
} from './data/tips';
import { speak } from './services/geminiService';

type TabType = 'tips' | 'practice' | 'flashcards' | 'fillblanks';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('tips');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(PRONUNCIATION_TIPS[0]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fill in the blanks state
  const [fillIndex, setFillIndex] = useState(0);
  const [fillInput, setFillInput] = useState('');
  const [fillFeedback, setFillFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [fillFinished, setFillFinished] = useState(false);

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const apiKeyMissing = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY';

  const filteredTips = PRONUNCIATION_TIPS.filter(tip => 
    tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tip.rule.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuizAnswer = (option: string) => {
    const isCorrect = option === HOMOPHONE_QUIZ[quizIndex].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback({ correct: true, message: "Correct! Well done." });
    } else {
      setFeedback({ correct: false, message: `Incorrect. The correct answer is "${HOMOPHONE_QUIZ[quizIndex].answer}".` });
    }

    setTimeout(() => {
      setFeedback(null);
      if (quizIndex < HOMOPHONE_QUIZ.length - 1) {
        setQuizIndex(i => i + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = fillInput.toLowerCase().trim() === FILL_BLANKS_EXERCISES[fillIndex].answer.toLowerCase();
    
    if (isCorrect) {
      setFillFeedback({ correct: true, message: "Correct!" });
      setScore(s => s + 1);
    } else {
      setFillFeedback({ correct: false, message: `Wrong. The answer is "${FILL_BLANKS_EXERCISES[fillIndex].answer}".` });
    }

    setTimeout(() => {
      setFillFeedback(null);
      setFillInput('');
      if (fillIndex < FILL_BLANKS_EXERCISES.length - 1) {
        setFillIndex(i => i + 1);
      } else {
        setFillFinished(true);
      }
    }, 2000);
  };

  const resetAll = () => {
    setQuizIndex(0);
    setScore(0);
    setQuizFinished(false);
    setFeedback(null);
    setFillIndex(0);
    setFillInput('');
    setFillFeedback(null);
    setFillFinished(false);
    setCardIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    resetAll();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">Pronunciation Master</h1>
          </div>
          <nav className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {[
              { id: 'tips', label: 'Tips', icon: BookOpen },
              { id: 'practice', label: 'Quiz', icon: CheckCircle2 },
              { id: 'flashcards', label: 'Cards', icon: Layers },
              { id: 'fillblanks', label: 'Fill', icon: Type }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {apiKeyMissing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm"
          >
            <div className="bg-amber-100 p-3 rounded-2xl">
              <Sparkles className="text-amber-600 w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-amber-900 font-bold">API Key Required for Audio</h3>
              <p className="text-amber-700 text-sm">
                To use the audio features on Vercel, you must add the <code className="bg-amber-100 px-1 rounded">GEMINI_API_KEY</code> environment variable in your Vercel project settings.
              </p>
            </div>
            <a 
              href="https://vercel.com/docs/projects/environment-variables" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              How to add it
            </a>
          </motion.div>
        )}

        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tips..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                {filteredTips.map((tip) => (
                  <button
                    key={tip.id}
                    onClick={() => setSelectedTip(tip)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 last:border-0 transition-colors flex items-center justify-between group ${
                      selectedTip?.id === tip.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedTip?.id === tip.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tip.id}
                      </span>
                      <span className="text-sm font-medium truncate">{tip.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      selectedTip?.id === tip.id ? 'translate-x-1 text-indigo-500' : 'text-slate-300 group-hover:translate-x-1'
                    }`} />
                  </button>
                ))}
              </div>
            </aside>

            {/* Content Area */}
            <section className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {selectedTip ? (
                  <motion.div
                    key={selectedTip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <span className="text-indigo-600 font-bold text-sm tracking-wider uppercase mb-2 block">Tip #{selectedTip.id}</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{selectedTip.title}</h2>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-2xl">
                        <BookOpen className="text-indigo-600 w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-100">
                      <p className="text-slate-700 leading-relaxed text-lg italic">
                        "{selectedTip.rule}"
                      </p>
                    </div>

                    <div className="space-y-8">
                      {selectedTip.categories ? (
                        selectedTip.categories.map((cat, idx) => (
                          <div key={idx} className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-indigo-400" />
                              {cat.name}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {cat.words.map((word, wIdx) => (
                                <WordCard key={wIdx} word={word} />
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {selectedTip.examples.map((ex, idx) => (
                            <WordCard key={idx} word={ex.word} phonetic={ex.phonetic} />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                    <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                    <p>Select a tip from the library to start practicing</p>
                  </div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="max-w-2xl mx-auto">
            {!quizFinished ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden"
              >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                  <motion.div 
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((quizIndex + 1) / HOMOPHONE_QUIZ.length) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mb-8 mt-2">
                  <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Question {quizIndex + 1} of {HOMOPHONE_QUIZ.length}</span>
                  <span className="text-sm font-medium text-slate-400">Score: {score}</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
                  {HOMOPHONE_QUIZ[quizIndex].question.split('___').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="inline-block w-20 border-b-2 border-indigo-300 mx-2" />}
                    </span>
                  ))}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {HOMOPHONE_QUIZ[quizIndex].options.map((option, idx) => (
                    <button
                      key={idx}
                      disabled={!!feedback}
                      onClick={() => handleQuizAnswer(option)}
                      className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left font-medium ${
                        feedback?.message.includes(`"${option}"`) && !feedback.correct
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : feedback?.correct && option === HOMOPHONE_QUIZ[quizIndex].answer
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700'
                      }`}
                    >
                      <span>{option}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); speak(option); }}
                          className="p-2 rounded-lg bg-white shadow-sm hover:bg-indigo-600 hover:text-white transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mt-8 p-4 rounded-2xl flex items-center gap-3 ${
                        feedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {feedback.correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="font-medium">{feedback.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <QuizResult score={score} total={HOMOPHONE_QUIZ.length} onReset={resetAll} />
            )}
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Pronunciation Flashcards</h2>
              <p className="text-slate-500">Flip the card to see the rule or sound</p>
            </div>

            <div className="relative h-80 w-full perspective-1000">
              <motion.div
                className="relative h-full w-full transition-all duration-500 preserve-3d cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8">
                  <span className="absolute top-6 left-6 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    {FLASHCARDS_DATA[cardIndex].category}
                  </span>
                  <h3 className="text-5xl font-bold text-slate-800 mb-4">{FLASHCARDS_DATA[cardIndex].front}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); speak(FLASHCARDS_DATA[cardIndex].front); }}
                    className="p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                  <p className="mt-8 text-slate-400 text-sm flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Click to flip
                  </p>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-indigo-600 border-2 border-indigo-500 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 rotate-y-180">
                  <span className="absolute top-6 left-6 text-xs font-bold text-indigo-200 uppercase tracking-widest">
                    Pronunciation Rule
                  </span>
                  <h3 className="text-4xl font-bold text-white text-center leading-tight">
                    {FLASHCARDS_DATA[cardIndex].back}
                  </h3>
                  <p className="mt-8 text-indigo-200 text-sm flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Click to flip back
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => { setCardIndex(i => Math.max(0, i - 1)); setIsFlipped(false); }}
                disabled={cardIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft className="w-5 h-5" /> Previous
              </button>
              <span className="text-slate-400 font-medium">
                {cardIndex + 1} / {FLASHCARDS_DATA.length}
              </span>
              <button
                onClick={() => { 
                  if (cardIndex < FLASHCARDS_DATA.length - 1) {
                    setCardIndex(i => i + 1);
                    setIsFlipped(false);
                  }
                }}
                disabled={cardIndex === FLASHCARDS_DATA.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
              >
                Next <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'fillblanks' && (
          <div className="max-w-2xl mx-auto">
            {!fillFinished ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Exercise {fillIndex + 1} of {FILL_BLANKS_EXERCISES.length}</span>
                  <span className="text-sm font-medium text-slate-400">Score: {score}</span>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-4 leading-snug">
                  {FILL_BLANKS_EXERCISES[fillIndex].question}
                </h2>
                <p className="text-slate-400 text-sm mb-8 italic">Hint: {FILL_BLANKS_EXERCISES[fillIndex].hint}</p>

                <form onSubmit={handleFillSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={fillInput}
                      onChange={(e) => setFillInput(e.target.value)}
                      placeholder="Type the missing letters..."
                      autoFocus
                      disabled={!!fillFeedback}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-xl font-bold text-slate-800"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={!fillInput || !!fillFeedback}
                      className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
                    >
                      Check Answer
                    </button>
                    <button
                      type="button"
                      onClick={() => speak(FILL_BLANKS_EXERCISES[fillIndex].full)}
                      className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                </form>

                <AnimatePresence>
                  {fillFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mt-6 p-4 rounded-2xl flex items-center gap-3 ${
                        fillFeedback.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {fillFeedback.correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      <span className="font-medium">{fillFeedback.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <QuizResult score={score} total={FILL_BLANKS_EXERCISES.length} onReset={resetAll} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2026 Pronunciation Master • Powered by Gemini AI</p>
      </footer>
    </div>
  );
}

function QuizResult({ score, total, onReset }: { score: number; total: number; onReset: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-2xl"
    >
      <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Trophy className="text-indigo-600 w-12 h-12" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Well Done!</h2>
      <p className="text-slate-500 mb-8">You scored {score} out of {total}</p>
      
      <div className="bg-slate-50 rounded-2xl p-6 mb-8">
        <p className="text-slate-600 italic">
          {score === total 
            ? "Perfect! You've mastered these rules." 
            : score > total / 2 
            ? "Great job! A little more practice and you'll be perfect." 
            : "Good effort! Review the tips and try again."}
        </p>
      </div>

      <button
        onClick={onReset}
        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
      >
        Try Again
      </button>
    </motion.div>
  );
}

const WordCard = ({ word, phonetic }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    setIsPlaying(true);
    await speak(word);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-200 hover:shadow-md transition-all">
      <div>
        <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{word}</h4>
        {phonetic && <span className="text-xs font-mono text-slate-400">{phonetic}</span>}
      </div>
      <button
        onClick={handlePlay}
        disabled={isPlaying}
        className={`p-3 rounded-xl transition-all ${
          isPlaying ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
        }`}
      >
        {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Play className="w-5 h-5" />}
      </button>
    </div>
  );
};
