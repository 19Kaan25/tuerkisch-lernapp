import React from 'react';
import { ArrowLeft, BookOpen, RotateCcw } from 'lucide-react';

const TYPES = [
  {
    key: 'Verb',
    label: 'Verben',
    emoji: '⚡',
    color: {
      card: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50',
      title: 'text-red-700 dark:text-red-300',
      bar: 'bg-red-500',
      barBg: 'bg-red-100 dark:bg-red-900/40',
      badge: 'bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300',
      learnBtn: 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none',
      reviewBtn: 'border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40',
    },
  },
  {
    key: 'Adjektiv',
    label: 'Adjektive',
    emoji: '🎨',
    color: {
      card: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50',
      title: 'text-emerald-700 dark:text-emerald-300',
      bar: 'bg-emerald-500',
      barBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      learnBtn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none',
      reviewBtn: 'border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
    },
  },
  {
    key: 'Nomen',
    label: 'Nomen',
    emoji: '📦',
    color: {
      card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50',
      title: 'text-blue-700 dark:text-blue-300',
      bar: 'bg-blue-500',
      barBg: 'bg-blue-100 dark:bg-blue-900/40',
      badge: 'bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
      learnBtn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-none',
      reviewBtn: 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40',
    },
  },
];

export default function WordTypeHubView({ wordTypeStats, onLearn, onReview, onBack }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Wortarten-Training</h2>
      </div>

      <p className="text-slate-500 dark:text-slate-400 text-sm px-1">
        Lerne Vokabeln gezielt nach Wortart — mit eigenem Lernfortschritt und zufälliger Reihenfolge.
      </p>

      <div className="space-y-4">
        {TYPES.map(({ key, label, emoji, color }) => {
          const stats = wordTypeStats[key] || { total: 0, learned: 0, due: 0, newWords: 0 };
          const progress = stats.total > 0 ? Math.round((stats.learned / stats.total) * 100) : 0;

          return (
            <div
              key={key}
              className={`rounded-3xl border p-5 space-y-4 ${color.card}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{emoji}</span>
                  <h3 className={`text-lg font-bold ${color.title}`}>{label}</h3>
                </div>
                {stats.due > 0 && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color.badge}`}>
                    {stats.due} fällig
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>{stats.learned} / {stats.total} gelernt</span>
                  <span>{progress}%</span>
                </div>
                <div className={`w-full h-2 rounded-full ${color.barBg}`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${color.bar}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onLearn(key)}
                  disabled={stats.newWords === 0}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-white font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${color.learnBtn}`}
                >
                  <BookOpen className="w-4 h-4" />
                  Lernen
                  {stats.newWords > 0 && (
                    <span className="text-white/70 text-xs">({stats.newWords})</span>
                  )}
                </button>
                <button
                  onClick={() => onReview(key)}
                  disabled={stats.due === 0}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${color.reviewBtn}`}
                >
                  <RotateCcw className="w-4 h-4" />
                  Üben
                  {stats.due > 0 && (
                    <span className="text-xs opacity-70">({stats.due})</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
