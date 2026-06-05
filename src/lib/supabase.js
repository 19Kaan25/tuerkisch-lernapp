import { createClient } from '@supabase/supabase-js';

// Fallbacks verhindern einen Crash beim Build ohne Env-Variablen.
// Ohne gültige Werte bleibt die App im Gast-Modus (kein Login möglich).
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
);
