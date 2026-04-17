import React from 'react';
import {
  BrainCircuit,
  BookOpen,
  RotateCcw,
  Eye,
  EyeOff,
  ArrowRight,
  Layers,
  GraduationCap,
} from 'lucide-react';

export default function DashboardView({
  learningDirection,
  setLearningDirection,
  stats,
  startLearnSession,
  startReviewSession,
  setView,
  setActiveGrammarTopic,
  startGrammarPractice,
  xRayMode,
  setXRayMode,
}) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl flex items-center border border-slate-200 dark:border-slate-700 shadow-sm">
        <button
          onClick={() => setLearningDirection('tr-de')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${learningDirection === 'tr-de' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <span className="text-lg">🇹🇷 ➔ 🇩🇪</span>
          <span className="hidden sm:inline">Verstehen</span>
        </button>
        <button
          onClick={() => setLearningDirection('de-tr')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${learningDirection === 'de-tr' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          <span className="text-lg">🇩🇪 ➔ 🇹🇷</span>
          <span className="hidden sm:inline">Sprechen</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl mb-8">
        <BrainCircuit className="w-16 h-16 text-indigo-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {learningDirection === 'tr-de' ? 'Lernfortschritt (Passiv)' : 'Lernfortschritt (Aktiv)'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center mt-2 max-w-sm">
          Lerne die häufigsten türkischen Wörter systematisch und effizient.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-800 dark:text-white">{stats.total}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Gesamt</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{stats.learned}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Gelernt</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center relative">
          {stats.due > 0 && <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>}
          <span className={`text-3xl font-black ${stats.due > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{stats.due}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">Fällig</span>
        </div>
      </div>

      <div className="space-y-3 mt-8">
        <button
          onClick={startLearnSession}
          disabled={stats.newWords === 0}
          className="w-full flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-2xl transition-all shadow-md shadow-indigo-200 dark:shadow-none"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6" />
            <div className="text-left">
              <div className="font-bold">Neue Wörter lernen</div>
              <div className="text-indigo-200 text-sm">{stats.newWords} verfügbar</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={startReviewSession}
          disabled={stats.due === 0}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 dark:text-white rounded-2xl transition-all"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className={`w-6 h-6 ${stats.due > 0 ? 'text-red-500' : 'text-slate-400'}`} />
            <div className="text-left">
              <div className="font-bold">Wiederholen</div>
              <div className="text-slate-500 text-sm">{stats.due} Karteikarten warten</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </button>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setView('deck_list')}
            className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl transition-all border border-transparent dark:border-slate-700 text-center"
          >
            <Layers className="w-6 h-6 text-slate-500 mb-2" />
            <div className="font-bold text-sm">Decks & Üben</div>
            <div className="text-slate-500 text-xs mt-1">Ohne Algorithmus</div>
          </button>

          <button
            onClick={() => {
              setActiveGrammarTopic(null);
              setView('grammar');
            }}
            className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-2xl transition-all border border-transparent dark:border-amber-800/50 text-center"
          >
            <GraduationCap className="w-6 h-6 text-amber-500 mb-2" />
            <div className="font-bold text-sm">Grammatik</div>
            <div className="text-amber-600/70 dark:text-amber-500/70 text-xs mt-1">A1 bis C1 Regeln</div>
          </button>
        </div>

        <button
          onClick={() => startGrammarPractice()}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-indigo-200 dark:border-indigo-800/50 text-slate-800 dark:text-white rounded-2xl transition-all"
        >
          <div className="flex items-center gap-3 text-left">
            <GraduationCap className="w-5 h-5 text-indigo-500" />
            <div>
              <div className="font-bold">Grammatik direkt üben</div>
              <div className="text-slate-500 text-sm">Quiz zu allen Teilbereichen starten</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            {xRayMode ? <Eye className="w-5 h-5 text-cyan-500" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
            <div>
              <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">X-Ray Vokalharmonie</div>
              <div className="text-xs text-slate-500 flex gap-2 mt-1">
                <span className="text-cyan-500 font-bold">Helle Vokale</span> •
                <span className="text-orange-500 font-bold">Dunkle Vokale</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setXRayMode(!xRayMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${xRayMode ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${xRayMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}


