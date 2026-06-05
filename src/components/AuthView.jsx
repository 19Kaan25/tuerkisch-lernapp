import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthView({ setView }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <button
        onClick={() => setView('dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Dashboard
      </button>

      <div className="text-center py-6">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Konto verbinden</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Fortschritt geräteübergreifend synchronisieren — kein Passwort nötig.
        </p>
      </div>

      {sent ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
          <p className="font-bold text-emerald-800 dark:text-emerald-300">Magic Link gesendet!</p>
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            Schau in dein Postfach für <strong>{email}</strong> und klicke auf den Link.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
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
            disabled={loading || !email}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 dark:shadow-none"
          >
            <Mail className="w-5 h-5" />
            {loading ? 'Wird gesendet…' : 'Magic Link senden'}
          </button>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            Du erhältst einen Einmal-Link per E-Mail. Kein Passwort erforderlich.
          </p>
        </form>
      )}
    </div>
  );
}
