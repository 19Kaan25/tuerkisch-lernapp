import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, RotateCcw, XCircle } from 'lucide-react';

export default function GrammarPracticeView({ sections, progress, onCompleteSection, setView, initialSectionId, onOpenTheoryForSection }) {
  const [activeSectionId, setActiveSectionId] = useState(initialSectionId || null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeSectionId) || null,
    [sections, activeSectionId],
  );

  const currentQuestion = activeSection ? activeSection.questions[questionIndex] : null;

  const resetSession = () => {
    setQuestionIndex(0);
    setSelectedIndex(null);
    setChecked(false);
    setAnswers([]);
    setShowResult(false);
  };

  const startSection = (sectionId) => {
    setActiveSectionId(sectionId);
    resetSession();
  };

  const goBackToSections = () => {
    setActiveSectionId(null);
    resetSession();
  };

  const checkAnswer = () => {
    if (selectedIndex === null || !currentQuestion || checked) return;
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    setAnswers((prev) => [...prev, isCorrect]);
    setChecked(true);
  };

  const nextQuestion = () => {
    if (!activeSection || !checked) return;

    const isLastQuestion = questionIndex >= activeSection.questions.length - 1;
    if (isLastQuestion) {
      const correct = answers.filter(Boolean).length;
      const total = activeSection.questions.length;
      onCompleteSection(activeSection.id, correct, total);
      setShowResult(true);
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setSelectedIndex(null);
    setChecked(false);
  };

  const restartSection = () => {
    resetSession();
  };

  const isFinished = !!activeSection && showResult;

  if (!activeSection) {
    const completedCount = sections.filter((section) => progress[section.id]).length;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
        <div className="flex items-center mb-2">
          <button
            onClick={() => setView('dashboard')}
            className="p-2 mr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Grammatik üben</h2>
            <p className="text-sm text-slate-500">Alle A1-B2-Teilbereiche im Quiz-Format</p>
          </div>
        </div>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl p-4 text-sm text-indigo-800 dark:text-indigo-200">
          {completedCount} von {sections.length} Teilbereichen bereits bearbeitet.
        </div>

        <div className="space-y-3 h-[68vh] overflow-y-auto pr-2 pb-4">
          {sections.map((section) => {
            const sectionProgress = progress[section.id];
            const bestText = sectionProgress
              ? `Bestes Ergebnis: ${sectionProgress.bestCorrect}/${sectionProgress.total}`
              : 'Noch nicht gestartet';

            return (
              <button
                key={section.id}
                onClick={() => startSection(section.id)}
                className="w-full text-left bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xs uppercase tracking-widest text-indigo-500 font-bold">{section.module}</div>
                  <div className="font-bold text-slate-800 dark:text-white text-lg mt-1">{section.title}</div>
                  <div className="text-sm text-slate-500 mt-1">{section.focus}</div>
                  <div className="text-xs text-slate-400 mt-2">{bestText}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-500 shrink-0 ml-3" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (isFinished) {
    const correct = answers.filter(Boolean).length;
    const total = answers.length;
    const accuracy = Math.round((correct / total) * 100);

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-8">
        <div className="flex items-center">
          <button
            onClick={goBackToSections}
            className="p-2 mr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Ergebnis</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm text-center space-y-3">
          <div className="text-sm uppercase tracking-widest text-slate-400">{activeSection.title}</div>
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">{accuracy}%</div>
          <div className="text-slate-600 dark:text-slate-300">{correct} von {total} richtig</div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            onClick={restartSection}
            className="py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Nochmal
          </button>
          <button
            onClick={() => onOpenTheoryForSection && onOpenTheoryForSection(activeSection.id)}
            className="py-3 bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded-2xl font-bold"
          >
            Zur Theorie
          </button>
          <button
            onClick={goBackToSections}
            className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold"
          >
            Nächster Bereich
          </button>
        </div>
      </div>
    );
  }

  const isAnswerCorrect = checked && selectedIndex === currentQuestion.correctIndex;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300 pb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={goBackToSections}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-sm text-slate-500 font-medium">
          {activeSection.title} • {questionIndex + 1}/{activeSection.questions.length}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-5">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{currentQuestion.prompt}</h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrectOption = checked && index === currentQuestion.correctIndex;
            const isWrongSelection = checked && isSelected && index !== currentQuestion.correctIndex;

            let classes = 'w-full text-left p-4 rounded-2xl border transition-colors';
            if (isCorrectOption) {
              classes += ' border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300';
            } else if (isWrongSelection) {
              classes += ' border-red-300 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            } else if (isSelected) {
              classes += ' border-indigo-300 bg-indigo-50 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
            } else {
              classes += ' border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/30 text-slate-700 dark:text-slate-200';
            }

            return (
              <button
                key={`${currentQuestion.id}-${index}`}
                onClick={() => !checked && setSelectedIndex(index)}
                className={classes}
                disabled={checked}
              >
                {option}
              </button>
            );
          })}
        </div>

        {checked && (
          <div className={`rounded-2xl p-4 text-sm border ${isAnswerCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50'}`}>
            <div className="font-bold flex items-center gap-2 mb-1">
              {isAnswerCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {isAnswerCorrect ? 'Richtig!' : 'Nicht ganz.'}
            </div>
            <div>{currentQuestion.explanation}</div>
          </div>
        )}
      </div>

      {!checked ? (
        <button
          onClick={checkAnswer}
          disabled={selectedIndex === null}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold"
        >
          Antwort prüfen
        </button>
      ) : (
        <button
          onClick={nextQuestion}
          className="w-full py-4 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-2xl font-bold"
        >
          {questionIndex >= activeSection.questions.length - 1 ? 'Ergebnis anzeigen' : 'Nächste Frage'}
        </button>
      )}
    </div>
  );
}

