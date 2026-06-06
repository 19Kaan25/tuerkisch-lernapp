import React from 'react';
import { AlertTriangle, ArrowRight, Check, Library, Volume2, X } from 'lucide-react';

const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;
const speak = (text) => {
  if (!hasTTS) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'tr-TR';
  window.speechSynthesis.speak(utt);
};

export default function FlashcardView({
  view,
  currentQueue,
  currentIndex,
  progress,
  getProgressKey,
  isCardFlipped,
  setIsCardFlipped,
  learningDirection,
  xRayMode,
  handleLearnNext,
  handleFreePracticeNext,
  handleReviewAnswer,
  setView,
  formatTurkishText,
}) {
  const isReview = view === 'review';
  const isFreePractice = view === 'free_practice';
  const word = currentQueue[currentIndex];
  const cardMeta = word && progress && getProgressKey ? progress[getProgressKey(word.id)] : null;
  const isLeech = !!cardMeta?.isLeech;

  if (!word) return null;

  let headerText = 'Neu Lernen';
  if (isReview) headerText = 'Wiederholung';
  if (isFreePractice) headerText = 'Freies Üben';

  const isRevealed = isCardFlipped || (!isReview && !isFreePractice);
  const isDeToTr = learningDirection === 'de-tr';

  let mainDisplayText;
  if (!isRevealed && isDeToTr) {
    mainDisplayText = word.de_trans;
  } else {
    mainDisplayText = formatTurkishText(`{${word.tr_root}}`, xRayMode, false);
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-slate-400 uppercase tracking-widest flex items-center gap-2">
          {isDeToTr ? '🇩🇪 ➔ 🇹🇷' : '🇹🇷 ➔ 🇩🇪'} • {headerText} • {currentIndex + 1} / {currentQueue.length}
        </span>
        <button
          onClick={() => (isFreePractice ? setView('deck_list') : setView('dashboard'))}
          className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col p-8 relative overflow-hidden transition-all duration-300">
        <div className="absolute top-6 left-6 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
          {word.type}
        </div>
        {isLeech && !isFreePractice && (
          <div className="absolute top-6 right-6 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Schwierige Karte
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <h1 className={`${!isRevealed && isDeToTr ? 'text-4xl md:text-5xl' : 'text-5xl md:text-6xl'} font-black text-slate-800 dark:text-white tracking-tight px-4`}>
            {mainDisplayText}
          </h1>

          <div className={`transition-all duration-500 flex flex-col items-center space-y-8 w-full ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <div className="flex flex-col items-center gap-3">
              <div className="text-2xl font-medium text-slate-500 dark:text-slate-400">
                {word.de_trans}
              </div>
              {hasTTS && (
                <button
                  onClick={() => speak(word.tr_root)}
                  className="flex items-center gap-1.5 text-slate-400 active:text-indigo-500 transition-colors px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm"
                  aria-label="Türkische Aussprache"
                >
                  <Volume2 className="w-4 h-4" />
                  Anhören
                </button>
              )}
            </div>

            <div className="w-full max-w-sm p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-left border border-slate-100 dark:border-slate-800 relative">
              <Library className="absolute top-5 right-5 w-5 h-5 text-slate-300 dark:text-slate-600" />
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-2 leading-relaxed pr-8">
                {formatTurkishText(word.ex_tr, xRayMode, true)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500">
                {word.ex_de}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 h-20 shrink-0">
        {!isReview && !isFreePractice ? (
          <button
            onClick={handleLearnNext}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg flex justify-center items-center gap-2 transition-transform active:scale-95"
          >
            <Check className="w-6 h-6" /> Verstanden, weiter
          </button>
        ) : !isCardFlipped ? (
          <button
            onClick={() => setIsCardFlipped(true)}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg flex justify-center items-center transition-transform active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            Karte umdrehen
          </button>
        ) : isFreePractice ? (
          <button
            onClick={handleFreePracticeNext}
            className="w-full py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-2xl font-bold text-lg flex justify-center items-center gap-2 transition-transform active:scale-95 shadow-lg"
          >
            Nächste Karte <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => handleReviewAnswer(0)}
              className="py-4 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-2xl font-bold transition-colors flex flex-col items-center justify-center leading-tight"
            >
              <span>Schwer</span>
              <span className="text-[10px] font-normal opacity-80 mt-1">Sofort</span>
            </button>
            <button
              onClick={() => handleReviewAnswer(1)}
              className="py-4 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl font-bold transition-colors"
            >
              Gut
            </button>
            <button
              onClick={() => handleReviewAnswer(2)}
              className="py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl font-bold flex flex-col items-center justify-center leading-none transition-colors"
            >
              <span>Einfach</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


