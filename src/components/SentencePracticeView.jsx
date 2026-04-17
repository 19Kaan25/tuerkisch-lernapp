import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle,
  Eye,
  EyeOff,
  Flame,
  CheckCircle,
  XCircle,
  MapPin,
  TrendingUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';

export default function SentencePracticeView({
  view,
  currentQueue,
  currentIndex,
  sentenceProgress,
  getProgressKey,
  isCardFlipped,
  setIsCardFlipped,
  learningDirection,
  xRayMode,
  handleLearnNext,
  handlePracticeNext,
  handleReviewAnswer,
  setView,
  formatTurkishText
}) {
  const sentence = currentQueue[currentIndex];
  const isReview = view === 'sentence_review';
  const isPractice = view === 'sentence_practice';
  
  const pKey = sentence ? getProgressKey(sentence.id) : null;
  const progressData = sentence ? sentenceProgress[pKey] : null;
  
  const [practiceMode, setPracticeMode] = useState('cloze'); // 'cloze' oder 'full'

  if (!sentence) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-safe">
      <div className="flex items-center justify-between p-4 pt-10 sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={() => setView('dashboard')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
              {currentIndex + 1} / {currentQueue.length}
            </span>
          </div>
        </div>

        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 opacity-0 cursor-default">
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex justify-center mb-4 space-x-2">
          <button 
            onClick={() => setPracticeMode('cloze')} 
            className={`px-4 py-1.5 text-sm font-bold rounded-full transition-all ${practiceMode === 'cloze' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            Lückentext
          </button>
          <button 
            onClick={() => setPracticeMode('full')} 
            className={`px-4 py-1.5 text-sm font-bold rounded-full transition-all ${practiceMode === 'full' ? 'bg-teal-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
          >
            Ganzsatz
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col min-h-[400px] mb-8 relative">
          
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
            <div className="flex items-center gap-2">
              {progressData?.failedStreak >= 2 && (
                <div className="bg-red-100/90 dark:bg-red-900/90 backdrop-blur-sm text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3" />
                  Schwer
                </div>
              )}
            </div>
            
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-2 border border-slate-100 dark:border-slate-700">
              <span className={`w-2 h-2 rounded-full ${learningDirection === 'tr-de' ? 'bg-indigo-500' : 'bg-rose-500'}`} />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {learningDirection === 'tr-de' ? 'TR ➔ DE' : 'DE ➔ TR'}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative mt-8">
            {sentence.level && (
              <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full mb-4">
                Niveau {sentence.level} • {sentence.topic || ''}
              </span>
            )}

            {practiceMode === 'cloze' && sentence.cloze_tr ? (
              <>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                  {sentence.de_prompt || sentence.de_translation}
                </p>
                <div className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-6 tracking-tight leading-tight">
                  {sentence.cloze_tr.split('___').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {formatTurkishText(part, xRayMode)}
                      {i < arr.length - 1 && (
                        <span className={`inline-block border-b-4 mx-2 px-6 pb-2 transition-colors ${isCardFlipped ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-slate-300 dark:border-slate-700 text-transparent'}`}>
                          {isCardFlipped ? formatTurkishText(sentence.cloze_answer, xRayMode) : sentence.cloze_answer}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">
                  {learningDirection === 'tr-de' ? 'Türkisch' : 'Deutsch'}
                </p>
                <div className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-6 tracking-tight leading-tight">
                  {learningDirection === 'tr-de' ? formatTurkishText(sentence.tr_sentence, xRayMode) : sentence.de_translation}
                </div>
              </>
            )}
          </div>

          <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col items-center min-h-[160px] justify-center border-t border-slate-100 dark:border-slate-800">
            {!isCardFlipped ? (
              <button
                onClick={() => setIsCardFlipped(true)}
                className="flex flex-col items-center text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-4 w-full"
              >
                <Eye className="w-8 h-8 mb-2 animate-bounce" />
                <span className="font-bold text-sm uppercase tracking-widest">Lösung anzeigen</span>
              </button>
            ) : (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 text-center">
                
                {practiceMode !== 'cloze' && (
                  <>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                      {learningDirection === 'tr-de' ? 'Deutsch' : 'Türkisch'}
                    </p>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                      {learningDirection === 'tr-de' ? sentence.de_translation : formatTurkishText(sentence.tr_sentence, xRayMode)}
                    </div>
                  </>
                )}

                {sentence.grammar_focus && (
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 px-3 py-1 rounded-full font-semibold border border-indigo-200 dark:border-indigo-800/50">
                      Grammatik: {sentence.grammar_focus}
                    </span>
                  </div>
                )}
                
                {isReview ? (
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <button 
                      onClick={() => handleReviewAnswer(0)}
                      className="flex flex-col items-center justify-center bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 p-4 rounded-2xl transition-colors border border-red-200 dark:border-red-800"
                    >
                      <XCircle className="w-6 h-6 mb-2" />
                      <span className="font-bold text-sm">Schwer</span>
                      <span className="text-[10px] opacity-70 mt-1">Sofort</span>
                    </button>
                    <button 
                      onClick={() => handleReviewAnswer(1)}
                      className="flex flex-col items-center justify-center bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 p-4 rounded-2xl transition-colors border border-amber-200 dark:border-amber-800"
                    >
                      <BrainCircuit className="w-6 h-6 mb-2" />
                      <span className="font-bold text-sm">Gut</span>
                      <span className="text-[10px] opacity-70 mt-1">1d</span>
                    </button>
                    <button 
                      onClick={() => handleReviewAnswer(2)}
                      className="flex flex-col items-center justify-center bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl transition-colors border border-emerald-200 dark:border-emerald-800"
                    >
                      <CheckCircle className="w-6 h-6 mb-2" />
                      <span className="font-bold text-sm">Leicht</span>
                      <span className="text-[10px] opacity-70 mt-1">3d</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={isPractice ? handlePracticeNext : handleLearnNext}
                    className="w-full py-4 bg-slate-800 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    <span>Weiter</span>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                )}

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

