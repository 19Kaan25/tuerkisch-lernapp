# Türkisch-Lernapp — CLAUDE.md

Dieses Dokument beschreibt Aufbau, Konventionen und Ziele der App für Claude als Co-Entwickler.

## Wichtig: Mobile First

Die App wird primär auf dem **Handy** genutzt. Alle UI-Entscheidungen müssen auf Touch ausgelegt sein:
- Kein Hover-abhängiges UI (`group-hover`, `hover:opacity`) für interaktive Elemente
- Buttons und Tap-Targets mindestens 44px hoch
- Kein Tooltip/Title als einzige Erklärungs-Quelle

## Projekt-Überblick

React-basierte Single-Page-App zum Lernen von Türkisch (Deutsch ↔ Türkisch) mit:
- **Vokabeltraining**: 1000 Wörter in 50 Decks à 20 Wörter
- **Satztraining**: 600 Sätze (A1–C2), nach Topic und CEFR-Level filterbar; 4 Übungsmodi (Tippen, Baukasten, Lückentext, Ganzsatz)
- **Grammatik**: 18 Quiz-Module à 10 Fragen (A1–C1); TTS für Aussprache in allen Modi
- **SRS**: Eigenes Spaced-Repetition-System (SM-2-Variante), bidirektional (TR→DE / DE→TR)
- **Persistenz**: `localStorage` (primär) + Supabase-Sync (optional, nach Login)

## Tech Stack

| Tool | Version | Zweck |
|------|---------|-------|
| React | 19.2 | UI (functional components + hooks) |
| Vite | 8.0 | Dev-Server, Build |
| Tailwind CSS | 4.2 | Styling (utility-first, dark mode) |
| Lucide React | 1.7 | Icons |
| PapaParse | 5.5 | CSV-Parsing für `sentences_tr_de.csv` |
| Supabase JS | 2.x | Auth (E-Mail + Passwort) + Datenbank-Sync |

## Befehle

```bash
npm run dev      # Vite Dev-Server (http://localhost:5173)
npm run build    # Production-Build nach dist/
npm run preview  # Production-Build lokal vorschauen
npm run lint     # ESLint prüfen
```

## Architektur

### View-Navigation

Kein React Router. Der `view`-State in `App.jsx` steuert alles:

```
dashboard → learn / review / deck_list / free_practice
         → grammar / grammar_practice
         → sentences / sentence_learn / sentence_review / sentence_practice
```

### Komponentenstruktur

| Datei | Aufgabe |
|-------|---------|
| `src/App.jsx` | Zentraler State, SRS-Logik, Datenfetch, View-Routing (~1075 Zeilen) |
| `src/components/DashboardView.jsx` | Startseite: Stats, Buttons, Richtungswahl |
| `src/components/FlashcardView.jsx` | Vokabel-Lern/Review-Interface mit Flip-Animation |
| `src/components/DeckListView.jsx` | Deck-Browser (25 Decks) |
| `src/components/GrammarView.jsx` | Grammatik-Theorie-Browser |
| `src/components/GrammarPracticeView.jsx` | Grammatik-Quiz (Multiple Choice) |
| `src/components/SentenceListView.jsx` | Satz-Browser mit Filter und Suche |
| `src/components/SentencePracticeView.jsx` | Satz-Übungen: Tippen, Baukasten (Token-Reordering), Lückentext, Ganzsatz; TTS |

**Alle Komponenten sind rein präsentational** — kein eigener State außer lokalem UI-State (z.B. Flip-Animation). Alle App-Logik und Daten kommen als Props aus `App.jsx`.

### State-Fluss

`App.jsx` fetcht Daten beim Mount, berechnet SRS-Zustände und gibt alles per Props weiter.
Rohdaten kommen via `fetch('/vocab.json')` und `fetch('/sentences_tr_de.csv')` aus `/public`.

### Auth & Sync

- `src/lib/supabase.js` — Supabase-Client (Credentials in `.env.local`)
- `src/hooks/useSync.js` — `loadProgressFromSupabase`, `pushVocabProgress`, `pushSentenceProgress`, `pushGrammarProgress`
- `src/components/AuthView.jsx` — E-Mail + Passwort Login/Registrierung (Name-Feld bei Signup)
- Gast-Modus: App funktioniert ohne Login (nur localStorage)
- Sync: Beim Login wird Supabase-State geladen; bei jeder Änderung debounced Push (2 s) an Supabase
- Migration: Wenn Supabase leer und localStorage hat Daten → automatischer Upload beim Erstlogin
- Supabase-Projekt: `kvnibezanmpclvijurky` (Region: eu-central-1, Org: Kaan Org)

## Datenmodell

### `public/vocab.json`

```json
{ "id": 1, "tr_root": "olmak", "de_trans": "sein / werden",
  "type": "Verb", "ex_tr": "Ben doktor {ol}mak istiyorum.", "ex_de": "..." }
```

`{}` in `ex_tr` markiert den Wortstamm — wird im X-Ray-Modus visuell hervorgehoben.

### `public/sentences_tr_de.csv` — relevante Felder

```
id, tr_sentence, de_translation, de_prompt,
level, topic, subtopic, grammar_focus, difficulty,
cloze_tr, cloze_answer, register
```

- `level`: CEFR A1–C2
- `cloze_tr` / `cloze_answer`: optional — wenn vorhanden, Lückentext-Modus aktiv
- `register`: neutral / umgangssprachlich / formal

### `src/data/grammarPracticeBank.js`

18 Module à 10 Fragen (A1–C1). Struktur pro Frage:
```js
{ id: "m1-1", prompt: "...", options: ["A","B","C","D"], correctIndex: 0, explanation: "..." }
```

Module 1–10: A1–B1 (Satzbau, Kasus, Besitz, Tempora, Modalität, Verneinung, Postpositionen)
Module 11–14: B1/B2 (Relativsätze, Adverbialsätze, Verbdiathese, Nominalisierung)
Module 15–18: B2/C1 (Bedingungssätze, Passiv+Kausativ, Evidentialität, Verbalnomen)

### SRS-Konstanten (`App.jsx`)

```
MIN_EASE = 1.3  |  MAX_EASE = 2.8  |  LEECH_THRESHOLD = 3
LEARNING_STEPS_MS = [10min, 1day, 3days]
DECK_SIZE = 20
Quality-Ratings: 0 = Again, 1 = Hard, 2 = Easy
```

Fortschrittsschlüssel in localStorage: `{id}_{direction}`, z.B. `42_tr_de`.
Bei neuen Lernmodi dasselbe Schema verwenden.

## Entwicklungsregeln

1. **Kein React Router** — View-Wechsel via `view`-State bleibt das einzige Muster.
2. **Kein TypeScript** — Projekt bleibt in plain JSX/JS.
3. **Tailwind-only** — kein CSS-in-JS, keine neuen eigenen CSS-Klassen.
4. **Neue Komponenten**: props-only, kein eigener Datenfetch, kein Context/Redux.
5. **CSV-Parse-Workaround nicht anfassen**: Ab Zeile ~151 der CSV sind Spalten verschoben.
   Der Workaround in `App.jsx` (Funktion in `handleCSVParse`) erkennt das heuristisch — nicht vereinfachen oder entfernen.
6. **Supabase-Sync ist fire-and-forget** — niemals auf Push-Promises warten, kein UI-Blocking.
7. **Keine Kommentare** außer wenn der Grund nicht aus dem Code selbst hervorgeht.

## Roadmap

- [x] Backend + User-Accounts (Supabase Auth + Sync, E-Mail+Passwort) — implementiert
- [x] TTS (Text-to-Speech) via Web Speech API — FlashcardView + SentencePracticeView
- [x] Tipp-Modus in SentencePracticeView (freie Texteingabe, Auto-SRS, TR-Sonderzeichen-Buttons)
- [x] Satzbaukasten (Token-Reordering) in SentencePracticeView
- [x] B2/C1 Grammatik-Module (15–18: Bedingungssätze, Passiv/Kausativ, Evidentialität, Verbalnomen)
- [ ] STT (Speech-to-Text) — Chrome-only, `SpeechRecognition` API, Button ausgeblendet auf iOS
- [ ] KI-Grammatik-Feedback (Claude Haiku via Supabase Edge Function, admin `ai_enabled` Flag)
- [ ] Konversations-Roleplay (Chat-Interface, vordef. Szenarien)
- [ ] PWA-Manifest für Installation auf Mobilgeräten
- [x] Analytics: Schwachstellen-Tracking, optimale Wiederholungszeiten — AnalyticsView mit Vokabel-Schwachstellen (ease/failedStreak/isLeech), Grammatik-Schwächen (per-Frage), Lernzeit-Analyse
