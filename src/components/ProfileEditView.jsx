import React, { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ProfileEditView({ user, setView }) {
  const [name, setName] = useState(user.user_metadata?.display_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name darf nicht leer sein.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ data: { display_name: name.trim() } });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setView('dashboard'), 1000);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <button
        onClick={() => setView('dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück
      </button>

      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Profil bearbeiten</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{user.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setSaved(false); }}
            placeholder="Dein Name"
            autoFocus
            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className={`w-full flex items-center justify-center gap-2 py-3 px-6 font-bold rounded-xl transition-all shadow-md ${saved ? 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white shadow-indigo-200 dark:shadow-none'}`}
        >
          <Check className="w-5 h-5" />
          {saved ? 'Gespeichert!' : loading ? 'Speichern…' : 'Speichern'}
        </button>
      </form>
    </div>
  );
}
