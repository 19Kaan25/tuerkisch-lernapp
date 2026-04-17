import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Filter, Search, Play } from 'lucide-react';

export default function SentenceListView({ sentences, startSentenceCategoryPractice, setView }) {
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const levels = useMemo(() => {
    const l = new Set(sentences.map(s => s.level).filter(Boolean));
    return ['all', ...Array.from(l).sort()];
  }, [sentences]);

  const categories = useMemo(() => {
    let filtered = sentences;
    if (filterLevel !== 'all') {
      filtered = filtered.filter(s => s.level === filterLevel);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        (s.topic && s.topic.toLowerCase().includes(q)) || 
        (s.subtopic && s.subtopic.toLowerCase().includes(q)) ||
        (s.tr_sentence && s.tr_sentence.toLowerCase().includes(q)) ||
        (s.de_translation && s.de_translation.toLowerCase().includes(q))
      );
    }

    const groups = {};
    filtered.forEach(s => {
      const key = `${s.level || '?'}-${s.topic || 'Sonstiges'}-${s.subtopic || ''}`;
      if (!groups[key]) {
        groups[key] = {
          level: s.level,
          topic: s.topic,
          subtopic: s.subtopic,
          sentences: []
        };
      }
      groups[key].sentences.push(s);
    });

    return Object.values(groups).sort((a, b) => {
      if (a.level !== b.level) return (a.level || '').localeCompare(b.level || '');
      return (a.topic || '').localeCompare(b.topic || '');
    });
  }, [sentences, filterLevel, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 flex flex-col h-screen">
      <div className="flex items-center gap-4 py-4 pt-10 px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 w-full border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setView('dashboard')}
          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-teal-500" />
          Sätze nach Themen
        </h2>
      </div>

      <div className="px-4 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Suchen nach Themen oder Wörtern..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 text-slate-800 dark:text-white placeholder-slate-400 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {levels.map(level => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filterLevel === level ? 'bg-teal-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
            >
              {level === 'all' ? 'Alle Niveaus' : level}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20 space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            Keine Sätze für diesen Filter gefunden.
          </div>
        ) : (
          categories.map((cat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-teal-200 dark:hover:border-teal-800/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {cat.level && (
                      <span className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-xs font-bold">
                        {cat.level}
                      </span>
                    )}
                    <span className="text-sm font-medium text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                      {cat.topic}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                    {cat.subtopic || cat.topic}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full">
                    {cat.sentences.length} Sätze
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => startSentenceCategoryPractice(cat.sentences)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-700 dark:text-teal-400 rounded-xl font-bold transition-all text-sm"
                >
                  <Play className="w-5 h-5" />
                  Üben starten
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

