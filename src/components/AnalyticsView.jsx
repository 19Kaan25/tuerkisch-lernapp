import React, { useMemo } from 'react';
import { AlertTriangle, BarChart2, ChevronLeft, Clock, Flame, GraduationCap, TrendingDown } from 'lucide-react';

export default function AnalyticsView({
  vocabProgress,
  grammarPracticeProgress,
  grammarQuestionStats,
  learningSessionLog,
  vocab,
  grammarPracticeSections,
  onBack,
}) {
  const weakVocab = useMemo(() => {
    const wordMap = {};
    Object.entries(vocabProgress).forEach(([key, d]) => {
      const rawId = key.replace('_rev', '');
      if (!wordMap[rawId] || d.ease < wordMap[rawId].d.ease) {
        wordMap[rawId] = { key, d };
      }
    });

    return Object.entries(wordMap)
      .filter(([, { d }]) => d.failedStreak >= 1 || d.ease <= 1.9 || d.isLeech)
      .map(([rawId, { key, d }]) => {
        const word = vocab.find(w => String(w.id) === rawId);
        if (!word) return null;
        return { key, d, word };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.d.isLeech !== b.d.isLeech) return b.d.isLeech ? 1 : -1;
        if (a.d.ease !== b.d.ease) return a.d.ease - b.d.ease;
        return b.d.failedStreak - a.d.failedStreak;
      })
      .slice(0, 15);
  }, [vocabProgress, vocab]);

  const weakGrammar = useMemo(() => {
    return grammarPracticeSections
      .map(section => {
        const p = grammarPracticeProgress[section.id];
        if (!p) return null;
        const accuracy = p.lastCorrect / p.total;
        const weakQuestions = section.questions
          .map(q => {
            const stats = grammarQuestionStats[q.id];
            if (!stats || stats.total === 0) return null;
            return { q, stats, accuracy: stats.correct / stats.total };
          })
          .filter(Boolean)
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, 3);
        return { section, p, accuracy, weakQuestions };
      })
      .filter(Boolean)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);
  }, [grammarPracticeProgress, grammarQuestionStats, grammarPracticeSections]);

  const { hourlyStats, bestHour, hasSufficientData } = useMemo(() => {
    const byHour = {};
    learningSessionLog.forEach(({ ts, correct }) => {
      const h = new Date(ts).getHours();
      if (!byHour[h]) byHour[h] = { correct: 0, total: 0 };
      byHour[h].total++;
      if (correct) byHour[h].correct++;
    });

    const qualified = Object.entries(byHour)
      .filter(([, s]) => s.total >= 5)
      .map(([h, s]) => ({ hour: +h, retention: s.correct / s.total, total: s.total }))
      .sort((a, b) => b.retention - a.retention);

    return {
      hourlyStats: qualified,
      bestHour: qualified[0] || null,
      hasSufficientData: qualified.length > 0,
    };
  }, [learningSessionLog]);

  const totalAnswered = learningSessionLog.length;
  const overallAccuracy =
    totalAnswered > 0
      ? Math.round((learningSessionLog.filter(e => e.correct).length / totalAnswered) * 100)
      : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            Meine Analyse
          </h2>
          {overallAccuracy !== null && (
            <p className="text-sm text-slate-500">
              {totalAnswered} Antworten · {overallAccuracy}% korrekt gesamt
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide px-1 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          Schwierige Vokabeln
        </h3>
        {weakVocab.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm text-slate-500 text-center">
            Noch keine Schwachstellen — weiter so!
          </div>
        ) : (
          <div className="space-y-2">
            {weakVocab.map(({ key, d, word }) => (
              <div
                key={key}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 dark:text-white truncate">{word.tr_root}</div>
                  <div className="text-sm text-slate-500 truncate">{word.de_trans}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {d.isLeech && (
                    <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Leech
                    </span>
                  )}
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Ease</div>
                    <div
                      className={`text-sm font-bold ${d.ease <= 1.5 ? 'text-red-500' : d.ease <= 1.8 ? 'text-orange-500' : 'text-amber-500'}`}
                    >
                      {d.ease.toFixed(1)}
                    </div>
                  </div>
                  {d.failedStreak >= 1 && (
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Fehler</div>
                      <div className="text-sm font-bold text-red-500 flex items-center gap-0.5">
                        <Flame className="w-3 h-3" />
                        {d.failedStreak}x
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide px-1 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-amber-500" />
          Grammatik-Schwächen
        </h3>
        {weakGrammar.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm text-slate-500 text-center">
            Noch keine Grammatik-Übungen — erst ein Modul starten!
          </div>
        ) : (
          <div className="space-y-3">
            {weakGrammar.map(({ section, accuracy, weakQuestions }) => (
              <div
                key={section.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-xs text-amber-500 font-bold uppercase tracking-wide">
                      {section.module}
                    </div>
                    <div className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">
                      {section.title}
                    </div>
                  </div>
                  <div
                    className={`text-2xl font-black shrink-0 ${accuracy < 0.5 ? 'text-red-500' : accuracy < 0.7 ? 'text-orange-500' : 'text-amber-500'}`}
                  >
                    {Math.round(accuracy * 100)}%
                  </div>
                </div>
                {weakQuestions.length > 0 && (
                  <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-700 pt-2">
                    <div className="text-xs text-slate-400 font-medium">Schwächste Fragen:</div>
                    {weakQuestions.map(({ q, accuracy: qAcc }) => (
                      <div key={q.id} className="flex items-start justify-between gap-3">
                        <div className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{q.prompt}</div>
                        <div className="text-xs font-bold text-red-500 shrink-0">{Math.round(qAcc * 100)}%</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wide px-1 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-500" />
          Optimale Lernzeit
        </h3>
        {!hasSufficientData ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm text-slate-500 text-center">
            Noch nicht genug Daten — lerne mindestens 5 Tage regelmäßig weiter.
          </div>
        ) : (
          <div className="space-y-3">
            {bestHour && (
              <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50 p-4 rounded-2xl">
                <div className="text-sm font-bold text-teal-700 dark:text-teal-300">
                  Du lernst am besten um {bestHour.hour}:00 Uhr
                </div>
                <div className="text-xs text-teal-600/70 dark:text-teal-400/70 mt-1">
                  {Math.round(bestHour.retention * 100)}% korrekt · {bestHour.total} Antworten
                </div>
              </div>
            )}
            <div className="space-y-2">
              {hourlyStats.map(({ hour, retention, total }) => (
                <div key={hour} className="flex items-center gap-3">
                  <div className="w-16 text-right text-sm text-slate-500 shrink-0 tabular-nums">
                    {hour}:00
                  </div>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${retention >= 0.8 ? 'bg-teal-500' : retention >= 0.65 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.round(retention * 100)}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-bold text-slate-600 dark:text-slate-300 shrink-0 tabular-nums">
                    {Math.round(retention * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
