import { supabase } from '../lib/supabase';

function rowToProgress(row) {
  return {
    interval: row.interval_days,
    ease: row.ease,
    learningStep: row.learning_step,
    failedStreak: row.failed_streak,
    isLeech: row.is_leech,
    nextReview: row.next_review,
  };
}

export async function loadProgressFromSupabase(user) {
  const userId = user.id;
  const [vocabRes, sentenceRes, grammarRes] = await Promise.all([
    supabase.from('vocab_progress').select('*').eq('user_id', userId),
    supabase.from('sentence_progress').select('*').eq('user_id', userId),
    supabase.from('grammar_progress').select('*').eq('user_id', userId),
  ]);

  const vocab = {};
  for (const row of vocabRes.data || []) vocab[row.progress_key] = rowToProgress(row);

  const sentence = {};
  for (const row of sentenceRes.data || []) sentence[row.progress_key] = rowToProgress(row);

  const grammar = {};
  for (const row of grammarRes.data || []) {
    grammar[row.section_id] = {
      attempts: row.attempts,
      bestCorrect: row.best_correct,
      total: row.total,
      lastCorrect: row.last_correct,
      lastPlayedAt: row.last_played_at,
    };
  }

  return { vocab, sentence, grammar };
}

export function pushVocabProgress(user, progress) {
  if (!user || !Object.keys(progress).length) return;
  const rows = Object.entries(progress).map(([key, p]) => ({
    user_id: user.id,
    progress_key: key,
    interval_days: p.interval,
    ease: p.ease,
    learning_step: p.learningStep ?? null,
    failed_streak: p.failedStreak,
    is_leech: p.isLeech,
    next_review: p.nextReview,
    updated_at: Date.now(),
  }));
  supabase.from('vocab_progress').upsert(rows).then(({ error }) => {
    if (error) console.error('Vocab sync error:', error.message);
  });
}

export function pushSentenceProgress(user, progress) {
  if (!user || !Object.keys(progress).length) return;
  const rows = Object.entries(progress).map(([key, p]) => ({
    user_id: user.id,
    progress_key: key,
    interval_days: p.interval,
    ease: p.ease,
    learning_step: p.learningStep ?? null,
    failed_streak: p.failedStreak,
    is_leech: p.isLeech,
    next_review: p.nextReview,
    updated_at: Date.now(),
  }));
  supabase.from('sentence_progress').upsert(rows).then(({ error }) => {
    if (error) console.error('Sentence sync error:', error.message);
  });
}

export function pushGrammarProgress(user, grammarProgress) {
  if (!user || !Object.keys(grammarProgress).length) return;
  const rows = Object.entries(grammarProgress).map(([sectionId, p]) => ({
    user_id: user.id,
    section_id: sectionId,
    attempts: p.attempts,
    best_correct: p.bestCorrect,
    total: p.total,
    last_correct: p.lastCorrect,
    last_played_at: p.lastPlayedAt || 0,
    updated_at: Date.now(),
  }));
  supabase.from('grammar_progress').upsert(rows).then(({ error }) => {
    if (error) console.error('Grammar sync error:', error.message);
  });
}
