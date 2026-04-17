import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export default function DeckListView({ decks, startFreePractice, setView }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setView('dashboard')}
          className="p-2 mr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Decks verwalten</h2>
          <p className="text-sm text-slate-500">Freies Üben ohne Fortschritts-Tracking</p>
        </div>
      </div>

      <div className="space-y-3 h-[65vh] overflow-y-auto pr-2 pb-4">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <div className="font-bold text-slate-800 dark:text-white">{deck.title}</div>
              <div className="text-sm text-slate-500">{deck.subtitle} ({deck.maxId - deck.minId + 1} Wörter)</div>
            </div>
            <button
              onClick={() => startFreePractice(deck)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors w-full sm:w-auto justify-center"
            >
              <Play className="w-4 h-4 fill-current" />
              Üben
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


