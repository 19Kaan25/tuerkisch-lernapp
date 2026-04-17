# context-summary

## Projektübersicht
Dies ist eine moderne Single-Page React-App (Vite, Tailwind CSS, Lucide React) zum systematischen Erlernen der türkischen Sprache. Das Ziel der Anwendung ist das Zusammenführen von Vokabeltraining, Grammatikübungen und dem Erlernen ganzer Sätze. Die Kernfunktion bildet ein integriertes Spaced-Repetition-System (SRS). Lerninhalte (JSON, CSV) werden asynchron aus dem `public`-Verzeichnis geladen, sodass keine Build-Schritte nötig sind, um Inhalte anzupassen. Der gesamte Lernfortschritt wird nutzerzentriert lokal im Browser (`localStorage`) gespeichert. Es gibt keinen klassischen Router, die gesamte Navigation wird zustandsbasiert in einer zentralen Komponente (`App.jsx`) abgewickelt. Diese Datei dient als "Memory-State" für zukünftige Agenten-Sitzungen.

## Aktueller Stand
  - `public/sentences_tr_de.csv` ist vorhanden und befuellt (601 Zeilen inkl. Header), aber noch nicht in die Laufzeit-Logik der App eingebunden.
  - Die App basiert auf zentralem View-Switching in `src/App.jsx` (`dashboard`, `learn`, `review`, `deck_list`, `free_practice`, `grammar`, `grammar_practice`).
  - Vokabeldaten werden aktuell aus `public/vocab.json` geladen; fuer Saetze gibt es noch keinen Loader/Parser im Code.
  - Spaced-Repetition-Felder sind bereits etabliert (`interval`, `ease`, `learningStep`, `failedStreak`, `isLeech`) und werden in `localStorage` persistiert.
  - Die letzte Implementierungsrunde fuer den neuen Bereich "Saetze lernen" wurde durch einen Server-Error unterbrochen; Umsetzung ist daher noch offen.

- **Getroffene Architektur-Entscheidungen**
  - Single-Page-Flow mit einem zentralen Root-State in `App.jsx` statt Router.
  - Daten aus `public/` per `fetch` laden, damit Content-Dateien (JSON/CSV) ohne Build-Step angepasst werden koennen.
  - Lernfortschritt je Lernrichtung ueber `getProgressKey` trennen (`tr-de` vs `de-tr`) und lokal speichern.
  - SRS-Logik in `App.jsx` zentral halten; UI-Komponenten (`FlashcardView` etc.) bleiben darstellungsnah.
  - Neue Lernbereiche sollen als eigener View mit separatem Progress-Key/Namensraum integriert werden, ohne bestehende Vokabel- und Grammatik-Flows zu brechen.

- **Naechste Schritte**
  - CSV-Schema fixieren (Pflichtspalten, Datentypen, erlaubte Werte) und einmalig gegen die 601 Zeilen validieren.
  - Einen robusten CSV-Parser-Loader fuer `public/sentences_tr_de.csv` einbauen (inkl. Fehlerhandling bei fehlerhaften Zeilen).
  - Neuen View `sentences` (Liste/Kategorien) + `sentence_practice` (Lern-/Wiederholmodus) implementieren und im Dashboard verlinken.
  - Eigenen Progress-Store fuer Saetze einfuehren (z. B. `turkishSentenceProgressV1`), kompatibel zur bestehenden SRS-Logik.
  - Nach Integration End-to-End pruefen: Laden, Kategorien, Session-Start, Antwortfluss, Persistenz, Reopen nach Reload.
