import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  HelpCircle,
  Eye,
  Flame,
  CheckCircle,
  XCircle,
  Send,
  Volume2
} from 'lucide-react';

const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;
const speak = (text) => {
  if (!hasTTS) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'tr-TR';
  window.speechSynthesis.speak(utt);
};

const TR_CHARS = ['ş', 'ğ', 'ı', 'ç', 'ö', 'ü'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parseTokens(sentence) {
  const parts = (sentence.tr_tokens || '').split('|').filter(Boolean);
  return parts.length >= 2 ? parts : sentence.tr_sentence.trim().split(/\s+/).filter(Boolean);
}

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

  const [practiceMode, setPracticeMode] = useState('full');
  const [typeData, setTypeData] = useState({ cardIndex: -1, input: '', correct: null });
  const [tokenData, setTokenData] = useState({ cardIndex: -1, selected: [], remaining: [], checked: false, correct: null });
  const inputRef = useRef(null);

  // Derive type state (auto-resets when card changes via cardIndex mismatch)
  const typeInput = typeData.cardIndex === currentIndex ? typeData.input : '';
  const typeCorrect = typeData.cardIndex === currentIndex ? typeData.correct : null;

  // Derive token state (cardIndex mismatch = not yet started for this card)
  const tkReady = tokenData.cardIndex === currentIndex;
  const tkSelected = tkReady ? tokenData.selected : [];
  const tkRemaining = tkReady ? tokenData.remaining : [];
  const tkChecked = tkReady ? tokenData.checked : false;
  const tkCorrect = tkReady ? tokenData.correct : null;
  const tkTotal = tkSelected.length + tkRemaining.length;

  const initTokens = () => {
    setTokenData({
      cardIndex: currentIndex,
      selected: [],
      remaining: shuffle(parseTokens(sentence).map((v, i) => ({ id: i, value: v }))),
      checked: false,
      correct: null,
    });
  };

  if (!sentence) return null;

  const normAnswer = (s) => s.trim().toLowerCase().replace(/[.,!?]/g, '');

  // --- Type mode handlers ---
  const handleTypeSubmit = () => {
    if (!typeInput.trim()) return;
    const correct = normAnswer(typeInput) === normAnswer(sentence.cloze_answer || '');
    setTypeData({ cardIndex: currentIndex, input: typeInput, correct });
    setIsCardFlipped(true);
  };

  const insertChar = (char) => {
    const input = inputRef.current;
    const s = input ? (input.selectionStart ?? typeInput.length) : typeInput.length;
    const e = input ? (input.selectionEnd ?? typeInput.length) : typeInput.length;
    const next = typeInput.slice(0, s) + char + typeInput.slice(e);
    setTypeData({ cardIndex: currentIndex, input: next, correct: null });
    requestAnimationFrame(() => {
      if (!input) return;
      input.focus();
      input.setSelectionRange(s + 1, s + 1);
    });
  };

  const handleTypeAdvance = () => {
    if (isReview) handleReviewAnswer(typeCorrect ? 2 : 0);
    else if (isPractice) handlePracticeNext();
    else handleLearnNext();
  };

  // --- Token mode handlers ---
  const addToken = (token) => {
    setTokenData({
      cardIndex: currentIndex,
      selected: [...tkSelected, token],
      remaining: tkRemaining.filter(t => t.id !== token.id),
      checked: false,
      correct: null,
    });
  };

  const removeToken = (token) => {
    setTokenData({
      cardIndex: currentIndex,
      selected: tkSelected.filter(t => t.id !== token.id),
      remaining: [...tkRemaining, token],
      checked: false,
      correct: null,
    });
  };

  const checkTokens = () => {
    const targetTokens = parseTokens(sentence);
    const correct =
      tkSelected.length === targetTokens.length &&
      tkSelected.every((t, i) => t.value === targetTokens[i]);
    setTokenData({ cardIndex: currentIndex, selected: tkSelected, remaining: tkRemaining, checked: true, correct });
    setIsCardFlipped(true);
  };

  const handleTokenAdvance = () => {
    if (isReview) handleReviewAnswer(tkCorrect ? 2 : 0);
    else if (isPractice) handlePracticeNext();
    else handleLearnNext();
  };

  const switchMode = (mode) => {
    setPracticeMode(mode);
    setTypeData({ cardIndex: -1, input: '', correct: null });
    if (mode === 'tokens') {
      initTokens();
    } else {
      setTokenData({ cardIndex: -1, selected: [], remaining: [], checked: false, correct: null });
    }
    setIsCardFlipped(false);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 dark:bg-slate-950 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-safe">
      <div className="flex items-center justify-between p-4 pt-10 sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setView('dashboard')}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
            {currentIndex + 1} / {currentQueue.length}
          </span>
        </div>

        <button className="p-2 rounded-full opacity-0 cursor-default">
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Mode toggle */}
        <div className="flex justify-center mb-4 gap-1.5">
          {[
            { id: 'type', label: 'Tippen', active: 'bg-indigo-600' },
            { id: 'tokens', label: 'Baukasten', active: 'bg-violet-600' },
            { id: 'cloze', label: 'Lückentext', active: 'bg-teal-600' },
            { id: 'full', label: 'Ganzsatz', active: 'bg-teal-600' },
          ].map(({ id, label, active }) => (
            <button
              key={id}
              onClick={() => switchMode(id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${practiceMode === id ? `${active} text-white` : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col mb-8 relative">

          {/* Card badges */}
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

          {/* Card body */}
          <div className={`flex flex-col items-center p-8 text-center relative mt-8 ${practiceMode === 'tokens' ? 'pb-4' : 'justify-center flex-1 min-h-[220px]'}`}>
            {sentence.level && (
              <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full mb-4">
                Niveau {sentence.level} • {sentence.topic || ''}
              </span>
            )}

            {practiceMode === 'type' ? (
              <>
                {learningDirection === 'de-tr' ? (
                  <div className="text-2xl font-bold text-slate-800 dark:text-white mb-4 leading-snug w-full">
                    {sentence.de_translation}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-5 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl w-full">
                    {sentence.de_translation}
                  </p>
                )}
                <div className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-snug w-full">
                  {(sentence.cloze_tr || '').split('___').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {formatTurkishText(part, xRayMode)}
                      {i < arr.length - 1 && (
                        typeCorrect === null ? (
                          <span className="inline-block border-b-4 border-indigo-300 dark:border-indigo-700 mx-2 px-8 pb-1 text-transparent select-none">
                            {sentence.cloze_answer}
                          </span>
                        ) : typeCorrect ? (
                          <span className="inline-block border-b-4 border-emerald-500 mx-2 px-2 pb-1 text-emerald-600 dark:text-emerald-400">
                            {formatTurkishText(sentence.cloze_answer, xRayMode)}
                          </span>
                        ) : (
                          <span className="inline mx-1">
                            <span className="inline-block border-b-4 border-red-400 mx-1 px-1 pb-1 text-red-400 dark:text-red-500 line-through opacity-70">
                              {typeInput.trim()}
                            </span>
                            <span className="inline-block border-b-4 border-emerald-500 mx-1 px-1 pb-1 text-emerald-600 dark:text-emerald-400">
                              {formatTurkishText(sentence.cloze_answer, xRayMode)}
                            </span>
                          </span>
                        )
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </>

            ) : practiceMode === 'tokens' ? (
              <>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl w-full">
                  {sentence.de_translation}
                </p>
                {/* Answer tray */}
                <div className="w-full min-h-[64px] flex flex-wrap gap-2 justify-center p-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  {tkSelected.length === 0 ? (
                    <span className="text-slate-400 dark:text-slate-600 text-sm self-center">Wörter hier ablegen…</span>
                  ) : tkSelected.map(token => (
                    <button
                      key={token.id}
                      onClick={() => !tkChecked && removeToken(token)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                        tkChecked
                          ? tkCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                            : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
                          : 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800'
                      }`}
                    >
                      {formatTurkishText(token.value, xRayMode)}
                    </button>
                  ))}
                </div>
              </>

            ) : practiceMode === 'cloze' && sentence.cloze_tr ? (
              <>
                {learningDirection === 'de-tr' ? (
                  <div className="text-2xl font-bold text-slate-800 dark:text-white mb-4 leading-snug w-full">
                    {sentence.de_translation}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl w-full">
                    {sentence.de_translation}
                  </p>
                )}
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

          {/* Bottom panel */}
          <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-5 flex flex-col items-center border-t border-slate-100 dark:border-slate-800">

            {/* --- TYPE MODE --- */}
            {practiceMode === 'type' ? (
              typeCorrect === null ? (
                <div className="w-full flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={typeInput}
                      onChange={e => setTypeData({ cardIndex: currentIndex, input: e.target.value, correct: null })}
                      onKeyDown={e => { if (e.key === 'Enter') handleTypeSubmit(); }}
                      placeholder="Türkisch eingeben…"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      className="flex-1 bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl px-4 py-3 text-lg font-semibold text-slate-800 dark:text-white focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 placeholder:text-slate-400 placeholder:font-normal"
                    />
                    <button
                      onClick={handleTypeSubmit}
                      disabled={!typeInput.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:bg-slate-200 disabled:dark:bg-slate-700 text-white disabled:text-slate-400 disabled:dark:text-slate-500 p-3 rounded-2xl transition-all flex items-center justify-center min-w-[52px]"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {TR_CHARS.map(ch => (
                      <button
                        key={ch}
                        type="button"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => insertChar(ch)}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-base font-bold text-indigo-600 dark:text-indigo-400 active:scale-95 transition-transform shadow-sm min-w-[44px]"
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-3 animate-in fade-in duration-300">
                  {sentence.grammar_focus && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 px-3 py-1 rounded-full font-semibold border border-indigo-200 dark:border-indigo-800/50">
                      Grammatik: {sentence.grammar_focus}
                    </span>
                  )}
                  {hasTTS && (
                    <button
                      onClick={() => speak(sentence.tr_sentence)}
                      className="flex items-center gap-1.5 text-slate-400 active:text-teal-500 transition-colors px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm"
                    >
                      <Volume2 className="w-4 h-4" />
                      Anhören
                    </button>
                  )}
                  <div className={`w-full py-3 px-4 rounded-2xl flex items-center gap-3 ${typeCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'}`}>
                    {typeCorrect
                      ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    }
                    <span className={`font-bold text-sm ${typeCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                      {typeCorrect ? 'Richtig!' : `Richtig wäre: ${sentence.cloze_answer}`}
                    </span>
                  </div>
                  {isReview ? (
                    <div className="grid grid-cols-3 gap-3 w-full">
                      <button onClick={() => handleReviewAnswer(0)} className="py-4 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-2xl font-bold transition-colors active:scale-95">Schwer</button>
                      <button onClick={() => handleReviewAnswer(1)} className="py-4 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl font-bold transition-colors active:scale-95">Gut</button>
                      <button onClick={() => handleReviewAnswer(2)} className="py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl font-bold transition-colors active:scale-95">Leicht</button>
                    </div>
                  ) : (
                    <button
                      onClick={handleTypeAdvance}
                      className="w-full py-4 bg-slate-800 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 active:scale-95 text-white rounded-2xl font-bold text-lg shadow-lg shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      <span>Weiter</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  )}
                </div>
              )

            /* --- TOKEN MODE --- */
            ) : practiceMode === 'tokens' ? (
              !tkReady ? (
                <button
                  onClick={initTokens}
                  className="w-full py-4 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white rounded-2xl font-bold text-lg transition-all"
                >
                  Starten
                </button>
              ) : !tkChecked ? (
                <div className="w-full flex flex-col gap-4">
                  {/* Token bank */}
                  <div className="flex flex-wrap gap-2 justify-center min-h-[48px]">
                    {tkRemaining.map(token => (
                      <button
                        key={token.id}
                        onClick={() => addToken(token)}
                        className="px-3 py-2 rounded-xl text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 active:scale-95 transition-transform shadow-sm"
                      >
                        {formatTurkishText(token.value, xRayMode)}
                      </button>
                    ))}
                  </div>
                  {tkSelected.length === tkTotal && tkTotal > 0 && (
                    <button
                      onClick={checkTokens}
                      className="w-full py-4 bg-violet-600 hover:bg-violet-500 active:scale-95 text-white rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Prüfen
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-3 animate-in fade-in duration-300">
                  {sentence.grammar_focus && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 px-3 py-1 rounded-full font-semibold border border-indigo-200 dark:border-indigo-800/50">
                      Grammatik: {sentence.grammar_focus}
                    </span>
                  )}
                  {hasTTS && (
                    <button
                      onClick={() => speak(sentence.tr_sentence)}
                      className="flex items-center gap-1.5 text-slate-400 active:text-teal-500 transition-colors px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm"
                    >
                      <Volume2 className="w-4 h-4" />
                      Anhören
                    </button>
                  )}
                  {!tkCorrect && (
                    <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm">
                      <span className="font-bold block mb-1">Richtige Reihenfolge:</span>
                      {formatTurkishText(sentence.tr_sentence, xRayMode)}
                    </div>
                  )}
                  <div className={`w-full py-3 px-4 rounded-2xl flex items-center gap-3 ${tkCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'}`}>
                    {tkCorrect
                      ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    }
                    <span className={`font-bold text-sm ${tkCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>
                      {tkCorrect ? 'Richtig!' : 'Leider falsch.'}
                    </span>
                  </div>
                  {isReview ? (
                    <div className="grid grid-cols-3 gap-3 w-full">
                      <button onClick={() => handleReviewAnswer(0)} className="py-4 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-2xl font-bold transition-colors active:scale-95">Schwer</button>
                      <button onClick={() => handleReviewAnswer(1)} className="py-4 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl font-bold transition-colors active:scale-95">Gut</button>
                      <button onClick={() => handleReviewAnswer(2)} className="py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl font-bold transition-colors active:scale-95">Leicht</button>
                    </div>
                  ) : (
                    <button
                      onClick={handleTokenAdvance}
                      className="w-full py-4 bg-slate-800 dark:bg-violet-600 hover:bg-slate-900 dark:hover:bg-violet-500 active:scale-95 text-white rounded-2xl font-bold text-lg shadow-lg shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                      <span>Weiter</span>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  )}
                </div>
              )

            /* --- CLOZE / FULL MODE --- */
            ) : !isCardFlipped ? (
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
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 px-3 py-1 rounded-full font-semibold border border-indigo-200 dark:border-indigo-800/50">
                      Grammatik: {sentence.grammar_focus}
                    </span>
                  </div>
                )}
                {hasTTS && (
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => speak(sentence.tr_sentence)}
                      className="flex items-center gap-1.5 text-slate-400 active:text-teal-500 transition-colors px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm"
                    >
                      <Volume2 className="w-4 h-4" />
                      Anhören
                    </button>
                  </div>
                )}
                {isReview ? (
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <button onClick={() => handleReviewAnswer(0)} className="py-4 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-2xl font-bold transition-colors active:scale-95">Schwer</button>
                    <button onClick={() => handleReviewAnswer(1)} className="py-4 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl font-bold transition-colors active:scale-95">Gut</button>
                    <button onClick={() => handleReviewAnswer(2)} className="py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-2xl font-bold transition-colors active:scale-95">Leicht</button>
                  </div>
                ) : (
                  <button
                    onClick={isPractice ? handlePracticeNext : handleLearnNext}
                    className="w-full py-4 bg-slate-800 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 active:scale-95 text-white rounded-2xl font-bold text-lg shadow-lg shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
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
