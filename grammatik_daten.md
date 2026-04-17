# Architektur & Wissensdatenbank: Türkisch A1 Lern-App

Dieses Dokument dient als zentrale Wissensbasis ("Source of Truth") für KI-Agenten und Entwickler zur Implementierung einer Türkisch-Lern-App (Niveau A1). Es enthält die linguistischen Grundregeln, essenzielle A1-Themen und didaktische Konzepte für das Übungsdesign.

---

## TEIL 1: Kernprinzipien der türkischen Sprache (System-Logik)
*Diese Regeln müssen in der App-Logik als fundamentale Algorithmen abgebildet werden.*

### 1.1 Agglutination (Das Lego-Prinzip)
Türkisch ist eine agglutinierende Sprache. Es gibt kaum Präpositionen (wie in, auf, zu), stattdessen werden Suffixe an den Wortstamm gehängt.
* **Struktur:** `Wortstamm + Plural + Possessiv + Fall (Kasus)`
* **Beispiel:** `Araba` (Auto) -> `Arabalar` (Autos) -> `Arabalarım` (meine Autos) -> `Arabalarımda` (in meinen Autos).

### 1.2 Vokalharmonie (Die wichtigste Backend-Logik)
Suffixe passen sich dem letzten Vokal des Wortstammes an. Das muss programmatisch abfangbar sein.
* **Kleine Vokalharmonie (2-Wege, z.B. für Plural, Lokativ):**
    * Letzter Vokal ist **a, ı, o, u** (dumpf) -> Suffix bekommt **a** (z.B. -lar, -da).
    * Letzter Vokal ist **e, i, ö, ü** (hell) -> Suffix bekommt **e** (z.B. -ler, -de).
* **Große Vokalharmonie (4-Wege, z.B. für Fragepartikel, Gegenwart):**
    * Letzter Vokal **a / ı** -> Suffix bekommt **ı** (z.B. mı)
    * Letzter Vokal **e / i** -> Suffix bekommt **i** (z.B. mi)
    * Letzter Vokal **o / u** -> Suffix bekommt **u** (z.B. mu)
    * Letzter Vokal **ö / ü** -> Suffix bekommt **ü** (z.B. mü)

### 1.3 Konsonanten-Assimilation (Fıstıkçı Şahap & Ketçap)
* **Erweichung (Ketçap):** Endet ein Wort auf k, t, ç, p und es folgt ein Vokal, werden sie weich: k->ğ, t->d, ç->c, p->b (z.B. `Köpek` -> `Köpeği`).
* **Verhärtung (Fıstıkçı Şahap):** Endet ein Wort auf f, s, t, k, ç, ş, h, p und das Suffix beginnt mit c, d, g, werden diese verhärtet: c->ç, d->t, g->k (z.B. `Sokak-da` wird zu `Sokakta`).

### 1.4 Satzbau (SOV)
Subjekt – Objekt – Verb. Das Verb steht IMMER am Ende.

---

## TEIL 2: Essenzielle A1-Grammatikthemen (Content)

### 2.1 Pronomen & Personalendungen ("Sein")
* **Pronomen:** Ben (ich), Sen (du), O (er/sie/es - kein Geschlecht!), Biz (wir), Siz (ihr/Sie), Onlar (sie).
* **Personalendungen:** Es gibt kein "sein" (am/are/is). Endungen werden an Nomen/Adjektive gehängt.
    * *Beispiel (Ben):* Öğretmen-im (Ich bin Lehrer). Doktor-um (Ich bin Arzt). -> *Benötigt 4-Wege-Vokalharmonie.*

### 2.2 Die wichtigsten Fälle (Lokale Suffixe)
* **Lokativ (Wo?):** -de / -da / -te / -ta (z.B. `Evde` = im Haus)
* **Dativ (Wohin?):** -e / -a / -ye / -ya (z.B. `Eve` = zum/ins Haus)
* **Ablativ (Woher?):** -den / -dan / -ten / -tan (z.B. `Evden` = aus dem Haus)

### 2.3 Zeiten (A1 Fokus)
* **Şimdiki Zaman (Präsens/Gegenwart -yor):** Drückt Handlungen aus, die jetzt passieren.
    * *Formel:* `Stamm + (Vokal) + yor + Personalendung`
    * *Beispiel:* Gel-i-yor-um (Ich komme).

### 2.4 Existenz & Besitz
* **Var / Yok:** Es gibt (var) / Es gibt nicht (yok). Im Türkischen nutzt man dies auch für "haben" (Mein Auto existiert = Ich habe ein Auto).
* **Possessiv-Pronomen:** Benim (mein), Senin (dein), Onun (sein/ihr).

---

## TEIL 3: Didaktik & UX für A1-Aufgaben (App-Design)

Um Aufgaben für absolute Anfänger zu bauen, muss die kognitive Belastung (Cognitive Load) minimiert werden.

### 3.1 Design-Prinzipien für Aufgaben
1.  **Isolation:** Jede Aufgabe darf nur EINE Regel abfragen (z.B. nur die Vokalharmonie, nicht gleichzeitig Vokalharmonie und unregelmäßige Verben).
2.  **Visuelle Verankerung (Color Coding):** Wortstämme und Suffixe müssen farblich getrennt sein. Der KI-Agent muss den Text in JSON-Strukturen parsen können, um diese Trennung im Frontend (UI) zu ermöglichen.
3.  **Fehler-Feedback:** Ein simples "Falsch" reicht nicht. Das Feedback muss lauten: "Falsch, da das Wort auf einen hellen Vokal ('e') endet, muss das Suffix ein 'e' enthalten (-de, nicht -da)."

### 3.2 Empfohlene Aufgabentypen (Task Types)
* **Type A: "Suffix-Sniper" (Multiple Choice)**
    * *Ziel:* Vokalharmonie trainieren.
    * *Ablauf:* Wort wird angezeigt (z.B. "Araba"). User muss den passenden Plural wählen (Button "-ler" oder "-lar").
* **Type B: "Lego-Builder" (Drag & Drop)**
    * *Ziel:* Satzbau (SOV) und Agglutination.
    * *Ablauf:* Einzelne Wörter und Suffix-Bausteine liegen wild durcheinander. User muss sie in die richtige Reihenfolge ziehen (z.B. `Ben` -> `Ev` -> `de` -> `Çay` -> `İç` -> `iyor` -> `um`).
* **Type C: "Harmonie-Slider" (Toggle/Fill-in)**
    * *Ziel:* Konsonantenverhärtung/Vokalharmonie im Kontext.
    * *Ablauf:* Satz mit Lücke: "Ben İstanbul'___ yaşıyorum." (da / de / ta / te).

---

## TEIL 4: Themen-Matrix (Modul-Fahrplan für die App)

Der KI-Agent sollte die Lektionen und Datenbanken in genau diesen hierarchischen Modulen aufbauen (Progression):

* **Modul 1: Das Fundament**
    * Lektion 1.1: Personalpronomen (Ben, Sen, O...)
    * Lektion 1.2: Plural (-ler / -lar) -> *Einführung 2-Wege-Vokalharmonie*
    * Lektion 1.3: Begrüßungen & Basis-Vokabeln
* **Modul 2: Sein & Haben**
    * Lektion 2.1: "Var" und "Yok" (Es gibt / gibt nicht)
    * Lektion 2.2: Das "Sein" (Personalendungen an Nomen: Hastayım = Ich bin krank) -> *Einführung 4-Wege-Vokalharmonie*
    * Lektion 2.3: Verneinung von Nomen (Değil = nicht)
* **Modul 3: Orte & Bewegung (Die Fälle)**
    * Lektion 3.1: Der Lokativ (-de/-da) - Wo bin ich? -> *Einführung Konsonantenverhärtung*
    * Lektion 3.2: Der Dativ (-e/-a) - Wohin gehe ich?
    * Lektion 3.3: Der Ablativ (-den/-dan) - Woher komme ich?
* **Modul 4: Action! (Präsens)**
    * Lektion 4.1: Das -yor Suffix (Positive Sätze)
    * Lektion 4.2: Verneinung im -yor (mı/mi/mu/mü)
    * Lektion 4.3: Fragen stellen (Soru eki: mı/mi)
* **Modul 5: Besitz**
    * Lektion 5.1: Possessivpronomen (Benim, Senin...)
    * Lektion 5.2: Besitz-Endungen am Wort (Benim araba-m)

---
*Prompt-Anweisung für den generierenden KI-Agenten:* Wenn du neue Übungen generierst, referenziere immer die Modulnummer. Gib die Daten idealerweise als JSON aus, wobei `wordStem`, `suffix`, und `translation` getrennte Keys sind, um das Color-Coding im UI zu unterstützen.