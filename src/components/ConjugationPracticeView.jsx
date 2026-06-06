import React, { useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  HelpCircle,
  Keyboard,
  ListChecks,
  RotateCcw,
  Volume2,
  XCircle,
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

const normAnswer = (s) => s.trim().toLowerCase().replace(/[.,!?]/g, '');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ConjugationPracticeView({ group, progress, onCompleteGroup, setView }) {
  const [modeChosen, setModeChosen] = useState(false);
  const [mode, setMode] = useState('select');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const inputRef = useRef(null);

  const exercise = group ? group.exercises[exerciseIndex] : null;

  const shuffledOptions = useMemo(() => {
    if (!exercise) return [];
    return shuffle([exercise.answer, ...exercise.alternatives]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseIndex, group]);

  const correctShuffledIndex = shuffledOptions.indexOf(exercise?.answer ?? '');

  const resetSession = () => {
    setExerciseIndex(0);
    setSelectedIndex(null);
    setInputValue('');
    setChecked(false);
    setAnswers([]);
    setShowResult(false);
    setShowHint(false);
  };

  const insertChar = (char) => {
    const input = inputRef.current;
    const s = input ? (input.selectionStart ?? inputValue.length) : inputValue.length;
    const e = input ? (input.selectionEnd ?? inputValue.length) : inputValue.length;
    const next = inputValue.slice(0, s) + char + inputValue.slice(e);
    setInputValue(next);
    requestAnimationFrame(() => {
      if (!input) return;
      input.focus();
      input.setSelectionRange(s + 1, s + 1);
    });
  };

  const checkSelectAnswer = () => {
    if (selectedIndex === null || checked) return;
    const isCorrect = selectedIndex === correctShuffledIndex;
    setAnswers((prev) => [...prev, isCorrect]);
    setChecked(true);
  };

  const checkTypeAnswer = () => {
    if (!inputValue.trim() || checked) return;
    const isCorrect = exercise.acceptedAnswers.some(
      (a) => normAnswer(inputValue) === normAnswer(a),
    );
    setAnswers((prev) => [...prev, isCorrect]);
    setChecked(true);
  };

  const nextExercise = () => {
    if (!checked) return;
    const isLast = exerciseIndex >= group.exercises.length - 1;
    if (isLast) {
      const correct = [...answers].filter(Boolean).length;
      const total = group.exercises.length;
      const exerciseIds = group.exercises.map((ex) => ex.id);
      onCompleteGroup(group.id, correct, total, answers, exerciseIds);
      setShowResult(true);
      return;
    }
    setExerciseIndex((prev) => prev + 1);
    setSelectedIndex(null);
    setInputValue('');
    setChecked(false);
    setShowHint(false);
  };

  if (!group) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-500">
        Keine Gruppe ausgewählt.
      </div>
    );
  }

  if (!modeChosen) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <div className="flex items-center">
          <button
            onClick={() => setView('conjugation')}
            className="p-2 mr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{group.title}</h2>
            <p className="text-sm text-slate-500">{group.focus}</p>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 px-1">
          Wie möchtest du üben?
        </p>

        <div className="space-y-3">
          <button
            onClick={() => { setMode('select'); setModeChosen(true); }}
            className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-600 rounded-2xl transition-all text-left"
          >
            <ListChecks className="w-7 h-7 text-violet-500 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 dark:text-white">Auswählen</div>
              <div className="text-sm text-slate-500 mt-0.5">Richtige Form aus 4 Optionen wählen</div>
            </div>
          </button>

          <button
            onClick={() => { setMode('type'); setModeChosen(true); }}
            className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-600 rounded-2xl transition-all text-left"
          >
            <Keyboard className="w-7 h-7 text-violet-500 shrink-0" />
            <div>
              <div className="font-bold text-slate-800 dark:text-white">Tippen</div>
              <div className="text-sm text-slate-500 mt-0.5">Form selbst eintippen — schwieriger</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correct = answers.filter(Boolean).length;
    const total = answers.length;
    const accuracy = Math.round((correct / total) * 100);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-8">
        <div className="flex items-center">
          <button
            onClick={() => setView('conjugation')}
            className="p-2 mr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Ergebnis</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div className="text-sm uppercase tracking-widest text-slate-400">{group.title}</div>
          <div className="text-5xl font-black text-violet-600 dark:text-violet-400">{accuracy}%</div>
          <div className="text-slate-600 dark:text-slate-300">{correct} von {total} richtig</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { resetSession(); }}
            className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Nochmal
          </button>
          <button
            onClick={() => setView('conjugation')}
            className="py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold"
          >
            Zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  const isAnswerCorrect = checked && (
    mode === 'select'
      ? selectedIndex === correctShuffledIndex
      : exercise.acceptedAnswers.some((a) => normAnswer(inputValue) === normAnswer(a))
  );

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300 pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('conjugation')}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-sm text-slate-500 font-medium">
          {group.title} • {exerciseIndex + 1}/{group.exercises.length}
        </div>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
        <div
          className="bg-violet-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((exerciseIndex + (checked ? 1 : 0)) / group.exercises.length) * 100}%` }}
        />
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-violet-500 font-bold mb-1">
              {exercise.givenLabel}
            </div>
            <div className="text-3xl font-black text-slate-800 dark:text-white">{exercise.given}</div>
          </div>
          {hasTTS && (
            <button
              onClick={() => speak(exercise.given)}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <p className="text-slate-700 dark:text-slate-300 font-medium">{exercise.task}</p>
          {exercise.hint && !checked && (
            <button
              onClick={() => setShowHint((v) => !v)}
              className="shrink-0 p-1 text-amber-400 hover:text-amber-500 transition-colors"
              title="Hinweis anzeigen"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {showHint && exercise.hint && !checked && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 text-sm text-amber-800 dark:text-amber-300">
            {exercise.hint}
          </div>
        )}

        {mode === 'select' && (
          <div className="space-y-3">
            {shuffledOptions.map((option, index) => {
              const isSelected = selectedIndex === index;
              const isCorrectOption = checked && index === correctShuffledIndex;
              const isWrongSelection = checked && isSelected && index !== correctShuffledIndex;

              let classes = 'w-full text-left p-4 rounded-2xl border transition-colors font-medium';
              if (isCorrectOption) {
                classes += ' border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
              } else if (isWrongSelection) {
                classes += ' border-red-300 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300';
              } else if (isSelected) {
                classes += ' border-violet-300 bg-violet-50 text-violet-800 dark:bg-violet-900/20 dark:text-violet-300';
              } else {
                classes += ' border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/30 text-slate-700 dark:text-slate-200';
              }

              return (
                <button
                  key={`${exercise.id}-${index}`}
                  onClick={() => !checked && setSelectedIndex(index)}
                  className={classes}
                  disabled={checked}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {mode === 'type' && (
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => !checked && setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !checked) checkTypeAnswer(); }}
              disabled={checked}
              placeholder="Form eintippen…"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-violet-400 dark:focus:border-violet-500 text-lg font-medium"
            />
            <div className="flex gap-2 flex-wrap">
              {TR_CHARS.map((ch) => (
                <button
                  key={ch}
                  onClick={() => insertChar(ch)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {checked && (
          <div className={`rounded-2xl p-4 text-sm border ${isAnswerCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50'}`}>
            <div className="font-bold flex items-center gap-2 mb-1">
              {isAnswerCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {isAnswerCorrect ? 'Richtig!' : `Nicht ganz. Richtig: ${exercise.answer}`}
            </div>
            <div>{exercise.explanation}</div>
            {hasTTS && (
              <button
                onClick={() => speak(exercise.answer)}
                className="mt-2 flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                <Volume2 className="w-3.5 h-3.5" /> Aussprache hören
              </button>
            )}
          </div>
        )}
      </div>

      {!checked ? (
        mode === 'select' ? (
          <button
            onClick={checkSelectAnswer}
            disabled={selectedIndex === null}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold"
          >
            Antwort prüfen
          </button>
        ) : (
          <button
            onClick={checkTypeAnswer}
            disabled={!inputValue.trim()}
            className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold"
          >
            Antwort prüfen
          </button>
        )
      ) : (
        <button
          onClick={nextExercise}
          className="w-full py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-2xl font-bold"
        >
          {exerciseIndex >= group.exercises.length - 1 ? 'Ergebnis anzeigen' : 'Nächste Aufgabe'}
        </button>
      )}
    </div>
  );
}
