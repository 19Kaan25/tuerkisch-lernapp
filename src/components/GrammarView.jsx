import React from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';

export default function GrammarView({ activeGrammarTopic, setActiveGrammarTopic, setView, grammarTopics }) {
  if (activeGrammarTopic) {
    const topic = grammarTopics.find((t) => t.id === activeGrammarTopic);

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-[85vh]">
        <div className="flex items-center mb-6 shrink-0">
          <button
            onClick={() => setActiveGrammarTopic(null)}
            className="p-2 mr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{topic.title}</h2>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 overflow-y-auto">
          {topic.content}
        </div>
      </div>
    );
  }

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
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Grammatik-Bibliothek</h2>
          <p className="text-sm text-slate-500">Das Fundament von A1 bis C1</p>
        </div>
      </div>

      <div className="space-y-3 h-[65vh] overflow-y-auto pr-2 pb-4">
        {grammarTopics.map((topic) => {
          const isAdvanced = topic.subtitle.includes('C1') || topic.subtitle.includes('B2');

          return (
            <button
              key={topic.id}
              onClick={() => setActiveGrammarTopic(topic.id)}
              className="w-full text-left bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all flex items-center justify-between group relative overflow-hidden"
            >
              {isAdvanced && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500"></div>
              )}

              <div className={isAdvanced ? 'pl-2' : ''}>
                <div className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                  {topic.title}
                </div>
                <div className="text-sm text-slate-500 mt-1">{topic.subtitle}</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-full group-hover:bg-amber-100 dark:group-hover:bg-amber-800/50 transition-colors shrink-0 ml-3">
                <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

