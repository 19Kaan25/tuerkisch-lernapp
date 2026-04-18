# context-summary

## Projektübersicht
Dies ist eine moderne Single-Page React-App (Vite, Tailwind CSS, Lucide React) zum systematischen Erlernen der türkischen Sprache. Das Ziel der Anwendung ist das Zusammenführen von Vokabeltraining, Grammatikübungen und dem Erlernen ganzer Sätze. Die Kernfunktion bildet ein integriertes Spaced-Repetition-System (SRS). Lerninhalte (JSON, CSV) werden asynchron aus dem `public`-Verzeichnis geladen, sodass keine Build-Schritte nötig sind, um Inhalte anzupassen. Der gesamte Lernfortschritt wird nutzerzentriert lokal im Browser (`localStorage`) gespeichert. Es gibt keinen klassischen Router, die gesamte Navigation wird zustandsbasiert in einer zentralen Komponente (`App.jsx`) abgewickelt. Diese Datei dient als "Memory-State" für zukünftige Agenten-Sitzungen.

## Aktueller Stand
- Die App basiert auf zentralem View-Switching in `src/App.jsx` (`dashboard`, `learn`, `review`, `deck_list`, `free_practice`, `grammar`, `grammar_practice`, `sentences`, `sentence_practice`, `sentence_learn`, `sentence_review`).
- Vokabeldaten werden aus `public/vocab.json` geladen und über `turkishVocabProgress` im LocalStorage getrackt.
- Satzdaten werden aus `public/sentences_tr_de.csv` mit `papaparse` dynamisch geladen und über `turkishSentenceProgressV1` im LocalStorage getrackt. 
- Das Spaced-Repetition-System (SRS) nutzt etablierte Felder (`interval`, `ease`, `learningStep`, `failedStreak`, `isLeech`). 
- Für Karteikarten, die mit "Schwer" bewertet werden, wurde der Cooldown entfernt, sie landen sofort (`nextReview = 0`) wieder im "Wiederholen"-Stapel.
- Auf dem Dashboard werden Statistiken (Gesamt, Gelernt, Fällig) für Vokabeln und Sätze übersichtlich und separat voneinander dargestellt.
- Für Sätze gibt es einen eigenen Bereich: 
  - `SentenceListView` aggregiert Sätze nach Oberthemen (`topic`) und den darin vorkommenden Niveaustufen.
  - `SentencePracticeView` dient als Lernumgebung und bietet zwei Ansicht-Modi: "Ganzsatz" (Standard) und "Lückentext" (sofern in CSV vorhanden). Ein Workaround/Heuristik-Parser für verschobene Spaltenformate in der CSV (ab Zeile 151) ist direkt ins Einlesen in `App.jsx` integriert.

## Getroffene Architektur-Entscheidungen
- **Kein Route-System:** Single-Page-Flow mit einem zentralen Root-State in `App.jsx` (komplette Navigation über `view` State).
- **Statische Daten ohne Build-Step:** Daten aus `public/` per `fetch` laden, damit Content-Dateien (JSON/CSV) jederzeit anpassbar bleiben.
- **Isolierter Progress:** Lernfortschritt ist je Inhalt (Vokabeln, Sätze) und je Lernrichtung über `getProgressKey` (`tr-de` vs `de-tr`) getrennt.
- **Zentrale SRS-Logik:** Die gesamte Spaced-Repetition-Logik liegt in der Central-Store-Logik in `App.jsx`; die reinen Darstellungs-/UI-Komponenten (`FlashcardView`, `SentencePracticeView`) erhalten nur Callback-Funktionen (z.B. `handleReviewAnswer(quality)`).

## Nächste Schritte / Potenziale
- **Backend & Account-System:** Umstellung der Datenspeicherung (Fortschritte, SRS-Logik) vom rein lokalen `localStorage` auf eine echte Datenbank. Einführung eines Account-Systems (Login/Registrierung), um geräteübergreifendes Lernen und Speichern des Lernfortschritts zu ermöglichen.
- Weiterer Ausbau der Grammatik-Übungen (optional ebenfalls über Spaced Repetition)
- Ausfeilen des Audio-Erlebnisses für türkische Text-to-Speech-Aussprache
- Ergänzung weiterer Niveaustufen oder Kategorien anhand neu befüllter JSON/CSV-Dateien
