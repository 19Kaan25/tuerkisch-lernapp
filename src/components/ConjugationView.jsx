import React from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const LEVEL_COLORS = {
  A1: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  A2: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  B1: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'B1/B2': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  B2: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  C1: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
};

const CATEGORY_ORDER = ['Verbkonjugation', 'Nomen & Kasus', 'Verbstimme', 'Wortbildung'];

export default function ConjugationView({ groups, progress, onStartGroup, setView }) {
  const completedCount = groups.filter((g) => progress[g.id]).length;

  const groupedByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    groups: groups.filter((g) => g.category === cat),
  })).filter((c) => c.groups.length > 0);

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
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Wortformen-Training</h2>
          <p className="text-sm text-slate-500">Konjugation &amp; Kasus aktiv üben</p>
        </div>
      </div>

      <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/50 rounded-2xl p-4 text-sm text-violet-800 dark:text-violet-200">
        {completedCount} von {groups.length} Gruppen bereits bearbeitet.
      </div>

      <div className="space-y-6 h-[68vh] overflow-y-auto pr-2 pb-4">
        {groupedByCategory.map(({ category, groups: catGroups }) => (
          <div key={category}>
            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold px-1 mb-3">
              {category}
            </div>
            <div className="space-y-3">
              {catGroups.map((group) => {
                const gp = progress[group.id];
                const bestText = gp
                  ? `Bestes Ergebnis: ${gp.bestCorrect}/${gp.total}`
                  : 'Noch nicht gestartet';
                const levelColor = LEVEL_COLORS[group.level] || LEVEL_COLORS.B1;

                return (
                  <button
                    key={group.id}
                    onClick={() => onStartGroup(group.id)}
                    className="w-full text-left bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor}`}>
                          {group.level}
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-white text-lg">{group.title}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{group.focus}</div>
                      <div className="text-xs text-slate-400 mt-2">{bestText}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-violet-500 shrink-0 ml-3" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
