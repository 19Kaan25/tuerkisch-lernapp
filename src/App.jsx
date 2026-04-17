import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrainCircuit } from 'lucide-react';
import DashboardView from './components/DashboardView';
import DeckListView from './components/DeckListView';
import GrammarView from './components/GrammarView';
import FlashcardView from './components/FlashcardView';
import GrammarPracticeView from './components/GrammarPracticeView';
import { GRAMMAR_PRACTICE_SECTIONS } from './data/grammarPracticeBank';
import { GRAMMAR_TOPICS } from './data/grammarTheoryTopics';

// --- LEGACY: GRAMMATIK DATEN (A1 bis C1) ---
const LEGACY_GRAMMAR_TOPICS = [
  {
    id: 'vokalharmonie',
    title: '1. Die Vokalharmonie',
    subtitle: 'Das wichtigste Gesetz der türkischen Sprache (A1)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <p>Im Türkischen passen sich alle Endungen (Suffixe) an den letzten Vokal des Wortstamms an. Das macht die Sprache so "melodisch". Es gibt zwei Hauptregeln:</p>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3 text-lg">A. Die Große Vokalharmonie (2-Wege)</h4>
          <p className="text-sm mb-4">Wird bei vielen einfachen Endungen genutzt, z.B. beim Plural (-lar/-ler) oder dem Lokativ (-da/-de "in/auf").</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold text-orange-500 w-24 shrink-0">a, ı, o, u</span> 
              <span>➔ Suffix mit <strong className="text-orange-500">A</strong> <br/><span className="text-slate-500">Beispiel: araba + l<strong className="text-orange-500">a</strong>r (Autos)</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-cyan-500 w-24 shrink-0">e, i, ö, ü</span> 
              <span>➔ Suffix mit <strong className="text-cyan-500">E</strong> <br/><span className="text-slate-500">Beispiel: ev + l<strong className="text-cyan-500">e</strong>r (Häuser)</span></span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
          <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-3 text-lg">B. Die Kleine Vokalharmonie (4-Wege)</h4>
          <p className="text-sm mb-4">Wird z.B. bei Fragepartikeln (mı/mi/mu/mü) oder Besitzanzeigern genutzt.</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold text-orange-500 w-24 shrink-0">a, ı</span> 
              <span>➔ Suffix mit <strong className="text-orange-500">I</strong> <br/><span className="text-slate-500">Beispiel: kapı m<strong className="text-orange-500">ı</strong>? (Ist es die Tür?)</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-cyan-500 w-24 shrink-0">e, i</span> 
              <span>➔ Suffix mit <strong className="text-cyan-500">İ</strong> <br/><span className="text-slate-500">Beispiel: ev m<strong className="text-cyan-500">i</strong>? (Ist es das Haus?)</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-orange-500 w-24 shrink-0">o, u</span> 
              <span>➔ Suffix mit <strong className="text-orange-500">U</strong> <br/><span className="text-slate-500">Beispiel: doktor m<strong className="text-orange-500">u</strong>? (Ist er Arzt?)</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-cyan-500 w-24 shrink-0">ö, ü</span> 
              <span>➔ Suffix mit <strong className="text-cyan-500">Ü</strong> <br/><span className="text-slate-500">Beispiel: kötü m<strong className="text-cyan-500">ü</strong>? (Ist es schlecht?)</span></span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'konsonanten',
    title: '2. Konsonanten-Erweichung',
    subtitle: 'Die "KETÇAP"-Regel (A1)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <p>Wenn ein türkisches Wort auf einen bestimmten harten Konsonanten endet und eine Endung folgt, die mit einem Vokal beginnt, "erweicht" dieser harte Konsonant.</p>
        
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
          <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-4">Die KETÇAP Regel:</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
              <span className="font-black text-xl text-slate-800 dark:text-white">K ➔ Ğ / G</span>
              <p className="text-sm text-slate-500 mt-2">köpe<strong className="text-indigo-500">k</strong> ➔ köpe<strong className="text-indigo-500">ğ</strong>i</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
              <span className="font-black text-xl text-slate-800 dark:text-white">T ➔ D</span>
              <p className="text-sm text-slate-500 mt-2">kağı<strong className="text-indigo-500">t</strong> ➔ kağı<strong className="text-indigo-500">d</strong>ı</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
              <span className="font-black text-xl text-slate-800 dark:text-white">Ç ➔ C</span>
              <p className="text-sm text-slate-500 mt-2">ağa<strong className="text-indigo-500">ç</strong> ➔ ağa<strong className="text-indigo-500">c</strong>ı</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm">
              <span className="font-black text-xl text-slate-800 dark:text-white">P ➔ B</span>
              <p className="text-sm text-slate-500 mt-2">kita<strong className="text-indigo-500">p</strong> ➔ kita<strong className="text-indigo-500">b</strong>ı</p>
            </div>
          </div>
        </div>
        <p className="text-sm italic">Hinweis: Eigennamen (wie Städte) werden in der Schrift nicht erweicht. Man trennt das Suffix ab: "Ahmet'e" (Zu Ahmet) - gesprochen wird es aber weich.</p>
      </div>
    )
  },
  {
    id: 'faelle',
    title: '3. Die wichtigsten Fälle',
    subtitle: 'Wo? Wohin? Woher? Wen? (A1/A2)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <p>Das Türkische nutzt keine Präpositionen (wie in, auf, zu, von), sondern hängt diese Informationen einfach hinten an das Wort an.</p>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 px-2 py-1 rounded text-xs">Lokativ</span> Wo?
            </h4>
            <p className="text-sm mt-2 font-medium">Endung: -da / -de / -ta / -te</p>
            <p className="text-sm text-slate-500 mt-1">ev<strong className="text-emerald-500">de</strong> (im Haus), araba<strong className="text-emerald-500">da</strong> (im Auto)</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 px-2 py-1 rounded text-xs">Dativ</span> Wohin? / Zu wem?
            </h4>
            <p className="text-sm mt-2 font-medium">Endung: -a / -e / -ya / -ye</p>
            <p className="text-sm text-slate-500 mt-1">ev<strong className="text-blue-500">e</strong> (nach Hause), Ali'<strong className="text-blue-500">ye</strong> (zu Ali)</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400 px-2 py-1 rounded text-xs">Ablativ</span> Woher? / Von wem?
            </h4>
            <p className="text-sm mt-2 font-medium">Endung: -dan / -den / -tan / -ten</p>
            <p className="text-sm text-slate-500 mt-1">ev<strong className="text-red-500">den</strong> (aus dem Haus), okul<strong className="text-red-500">dan</strong> (von der Schule)</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 px-2 py-1 rounded text-xs">Akkusativ</span> Wen? / Was? (bestimmt)
            </h4>
            <p className="text-sm mt-2 font-medium">Endung: -ı / -i / -u / -ü</p>
            <p className="text-sm text-slate-500 mt-1">kitab<strong className="text-amber-500">ı</strong> okuyorum (ich lese <i>das (bestimmte)</i> Buch)</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'zeiten',
    title: '4. Die vier wichtigsten Zeiten',
    subtitle: 'Präsens, Aorist, Vergangenheit, Zukunft (A2/B1)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <p>Im Türkischen wird die Zeit direkt an den Verbstamm gehängt, danach folgt die Personalendung (ich, du, er...).</p>
        
        <div className="grid gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-l-blue-500">
            <h4 className="font-bold">1. Şimdiki Zaman (Präsens / Jetzt)</h4>
            <p className="text-sm mt-1">Sagt aus, was <i>genau in diesem Moment</i> passiert.</p>
            <div className="mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
              <code className="text-blue-600 dark:text-blue-400 text-sm">gel-iyor-um</code> <span className="text-sm text-slate-500">(ich komme gerade)</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-l-emerald-500">
            <h4 className="font-bold">2. Geniş Zaman (Aorist / Allgemein)</h4>
            <p className="text-sm mt-1">Gewohnheiten, Fakten oder Bitten ("Würdest du...?").</p>
            <div className="mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
              <code className="text-emerald-600 dark:text-emerald-400 text-sm">gel-ir-im</code> <span className="text-sm text-slate-500">(ich komme gewöhnlich / ich werde kommen)</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-l-orange-500">
            <h4 className="font-bold">3. Geçmiş Zaman (Vergangenheit)</h4>
            <p className="text-sm mt-1"><strong>-di</strong> (Miterlebtes) vs. <strong>-miş</strong> (Erzähltes / Hörensagen).</p>
            <div className="mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded space-y-1">
              <div><code className="text-orange-600 dark:text-orange-400 text-sm">gel-di-m</code> <span className="text-sm text-slate-500">(ich bin gekommen - sicher)</span></div>
              <div><code className="text-orange-600 dark:text-orange-400 text-sm">gel-miş-im</code> <span className="text-sm text-slate-500">(ich sei gekommen / habe angeblich...)</span></div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-l-4 border-l-purple-500">
            <h4 className="font-bold">4. Gelecek Zaman (Zukunft)</h4>
            <p className="text-sm mt-1">Geplante Handlungen in der Zukunft.</p>
            <div className="mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
              <code className="text-purple-600 dark:text-purple-400 text-sm">gel-ecek-im ➔ geleceğim</code> <span className="text-sm text-slate-500">(ich werde kommen)</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'izafet',
    title: '5. Besitz & Genitiv (Das Izafet)',
    subtitle: 'Die Autotür, Mein Haus (B1)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <p>Um Besitz oder Zugehörigkeit ("das Haus des Lehrers", "die Autotür") auszudrücken, müssen im Türkischen <strong>beide</strong> Nomen eine Endung erhalten.</p>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-2xl border border-amber-100 dark:border-amber-800/50">
          <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-2">Die Formel:</h4>
          <p className="font-mono text-center text-lg my-4">
            Besitzer<strong className="text-amber-600">-(n)in</strong> + Besitz<strong className="text-amber-600">-(s)i</strong>
          </p>
          
          <ul className="space-y-4">
            <li className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
              <div className="font-bold">Evin kapısı</div>
              <div className="text-sm text-slate-500">ev<strong className="text-amber-500">-in</strong> (des Hauses) kapı<strong className="text-amber-500">-sı</strong> (seine Tür) ➔ Die Haustür</div>
            </li>
            <li className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
              <div className="font-bold">Öğretmenin arabası</div>
              <div className="text-sm text-slate-500">öğretmen<strong className="text-amber-500">-in</strong> (des Lehrers) araba<strong className="text-amber-500">-sı</strong> (sein Auto) ➔ Das Auto des Lehrers</div>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'relativsaetze',
    title: '6. Relativsätze (Partizipien)',
    subtitle: 'Der Mann, der liest / Das Buch, das ich lese (B2)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400 px-2 py-1 rounded text-xs font-bold tracking-widest uppercase">C1 Relevant</span>
        </div>
        <p>Im Türkischen gibt es keine Wörter wie "der, die, das" oder "welcher". Relativsätze werden stattdessen in <strong>Adjektive (Partizipien)</strong> umgewandelt und vor das Nomen gestellt.</p>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-2 border-rose-100 dark:border-rose-900/50">
            <h4 className="font-bold text-rose-600 dark:text-rose-400 text-lg">1. Subjekt-Partizip (-an / -en)</h4>
            <p className="text-sm mt-1 mb-3">Wird benutzt, wenn das Bezugswort die Aktion <strong>selbst ausführt</strong> (Aktiv).</p>
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded">
              <div className="font-mono">Gelen adam</div>
              <div className="text-sm text-slate-500">Gel<strong className="text-rose-500">-en</strong> (kommend) adam (Mann) ➔ Der Mann, der kommt.</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded mt-2">
              <div className="font-mono">Okuyan çocuk</div>
              <div className="text-sm text-slate-500">Oku<strong className="text-rose-500">-yan</strong> (lesend) çocuk (Kind) ➔ Das Kind, das liest.</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border-2 border-indigo-100 dark:border-indigo-900/50">
            <h4 className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">2. Objekt-Partizip (-dık / -diği)</h4>
            <p className="text-sm mt-1 mb-3">Wird benutzt, wenn <strong>mit dem Bezugswort etwas gemacht wird</strong> (Passiv / Ziel der Handlung). Hierbei muss angehängt werden, <i>wer</i> es macht (Besitzendung).</p>
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded">
              <div className="font-mono">Okuduğum kitap</div>
              <div className="text-sm text-slate-500">Oku<strong className="text-indigo-500">-duğ-um</strong> (mein Gelesenes) kitap ➔ Das Buch, das ich lese.</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded mt-2">
              <div className="font-mono">Gittiğimiz restoran</div>
              <div className="text-sm text-slate-500">Git<strong className="text-indigo-500">-tiğ-imiz</strong> (unser Gegangenes) restoran ➔ Das Restaurant, zu dem wir gehen.</div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'adverbialsaetze',
    title: '7. Komplexe Satzverbindungen',
    subtitle: 'Gerundien (Adverbialsätze) (C1)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 px-2 py-1 rounded text-xs font-bold tracking-widest uppercase">C1 Kernkompetenz</span>
        </div>
        <p>Um flüssiges C1-Türkisch zu sprechen, verbindet man Sätze nicht mit "und" oder "weil", sondern hängt Zeit- oder Art-Suffixe an den Verbstamm (sogenannte Gerundien / Zarf-Fiiller).</p>
        
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700">
              <th className="py-2">Suffix</th>
              <th className="py-2">Bedeutung</th>
              <th className="py-2">Beispiel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <tr>
              <td className="py-3 font-bold text-purple-600 dark:text-purple-400">-erek / -arak</td>
              <td className="py-3">indem / auf die Art</td>
              <td className="py-3 text-slate-500">Gül<strong className="text-purple-500">erek</strong> geldi. <br/>(Er kam lachend.)</td>
            </tr>
            <tr>
              <td className="py-3 font-bold text-purple-600 dark:text-purple-400">-ip / -ıp</td>
              <td className="py-3">und danach (verbindet zwei Verben)</td>
              <td className="py-3 text-slate-500">Gid<strong className="text-purple-500">ip</strong> döneceğim. <br/>(Ich gehe hin und komme zurück.)</td>
            </tr>
            <tr>
              <td className="py-3 font-bold text-purple-600 dark:text-purple-400">-ince / -ınca</td>
              <td className="py-3">sobald / als (zeitlich)</td>
              <td className="py-3 text-slate-500">Eve var<strong className="text-purple-500">ınca</strong> ara. <br/>(Sobald du ankommst, ruf an.)</td>
            </tr>
            <tr>
              <td className="py-3 font-bold text-purple-600 dark:text-purple-400">-ken</td>
              <td className="py-3">während</td>
              <td className="py-3 text-slate-500">Uyuyor<strong className="text-purple-500">ken</strong>... <br/>(Während ich schlief...)</td>
            </tr>
            <tr>
              <td className="py-3 font-bold text-purple-600 dark:text-purple-400">-dikçe</td>
              <td className="py-3">je mehr / solange</td>
              <td className="py-3 text-slate-500">Çalış<strong className="text-purple-500">tıkça</strong> kazanırsın. <br/>(Je mehr du arbeitest, desto mehr gewinnst du.)</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  },
  {
    id: 'verbmodifikationen',
    title: '8. Verb-Erweiterungen (Çatı)',
    subtitle: 'Kausativ, Passiv, Reflexiv (C1)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 px-2 py-1 rounded text-xs font-bold tracking-widest uppercase">C1 Relevant</span>
        </div>
        <p>Im Türkischen kann man die Bedeutung eines Verbs komplett verändern, indem man Silben zwischen den Stamm und die Zeitendung schiebt.</p>

        <div className="grid gap-3">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-teal-600 dark:text-teal-400">1. Kausativ (Veranlassungsform): -dir / -t</h4>
            <p className="text-sm mt-1">Etwas machen <i>lassen</i> oder jemanden dazu bringen.</p>
            <div className="text-sm mt-2 font-mono">yapmak (machen) ➔ yap<strong className="text-teal-500">tır</strong>mak (machen lassen)</div>
            <div className="text-sm text-slate-500">Arabamı tamir et<strong className="text-teal-500">tir</strong>dim. (Ich habe mein Auto reparieren lassen.)</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-teal-600 dark:text-teal-400">2. Passiv: -il / -in</h4>
            <p className="text-sm mt-1">Die Handlung wird ausgeführt, ohne dass der Täter wichtig ist.</p>
            <div className="text-sm mt-2 font-mono">görmek (sehen) ➔ gör<strong className="text-teal-500">ül</strong>mek (gesehen werden)</div>
            <div className="text-sm text-slate-500">Ev temizlen<strong className="text-teal-500">di</strong>. (Das Haus wurde geputzt.)</div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-teal-600 dark:text-teal-400">3. Reziprok (Gegenseitig): -iş</h4>
            <p className="text-sm mt-1">Etwas miteinander oder gegenseitig tun.</p>
            <div className="text-sm mt-2 font-mono">görmek (sehen) ➔ gör<strong className="text-teal-500">üş</strong>mek (sich gegenseitig sehen / treffen)</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'indirekterede',
    title: '9. Die Indirekte Rede',
    subtitle: 'Er sagte, dass... (Dolaylı Anlatım) (C1)',
    content: (
      <div className="space-y-6 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400 px-2 py-1 rounded text-xs font-bold tracking-widest uppercase">C1 Meisterklasse</span>
        </div>
        <p>Wenn du sagen willst "Er hat gesagt, DASS er kommt", nutzt du im Türkischen kein separates Wort für "dass". Du wandelst den Satz wieder in ein Partizip-Konstrukt (ähnlich wie bei den Relativsätzen) um.</p>
        
        <div className="bg-rose-50 dark:bg-rose-900/10 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/30">
          <h4 className="font-bold text-rose-700 dark:text-rose-400 mb-2">Die Formel:</h4>
          <p className="text-sm">Man nutzt das Objekt-Partizip <strong>(-dik / -ecek)</strong> + <strong>Besitzendung</strong> + <strong>Akkusativ (-i)</strong>.</p>
          
          <div className="mt-4 space-y-4">
            <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
              <div className="text-xs text-slate-400 mb-1">Direkt: "Ben hastayım." (Ich bin krank.)</div>
              <div className="font-bold">Hasta ol<strong className="text-rose-500">duğ-un-u</strong> söyledi.</div>
              <div className="text-sm text-slate-500">Er sagte, dass er krank ist. (Wörtlich: Er sagte <i>sein Kranksein</i>).</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-3 rounded shadow-sm">
              <div className="text-xs text-slate-400 mb-1">Direkt: "Yarın geleceğim." (Ich werde morgen kommen.)</div>
              <div className="font-bold">Yarın gel<strong className="text-rose-500">eceğ-in-i</strong> belirtti.</div>
              <div className="text-sm text-slate-500">Er gab an, dass er morgen kommen wird.</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

// --- HELPER FUNKTIONEN ---

const formatTurkishText = (text, xRayOn, boldRoot = false) => {
  if (!text) return null;
  const parts = text.split(/(\{.*?\})/g);
  
  return parts.map((part, index) => {
    const isRoot = part.startsWith('{') && part.endsWith('}');
    const cleanText = isRoot ? part.slice(1, -1) : part;

    const styledChars = cleanText.split('').map((char, charIndex) => {
      const lower = char.toLowerCase();
      const isLightVowel = ['e', 'i', 'ö', 'ü'].includes(lower);
      const isDarkVowel = ['a', 'ı', 'o', 'u'].includes(lower);

      if (xRayOn) {
        if (isLightVowel) return <span key={charIndex} className="text-cyan-500 font-bold">{char}</span>;
        if (isDarkVowel) return <span key={charIndex} className="text-orange-500 font-bold">{char}</span>;
      }
      return char;
    });

    if (isRoot && boldRoot) {
      return (
        <span key={index} className="border-b-2 border-indigo-400 pb-0.5 font-bold text-indigo-950 dark:text-indigo-100">
          {styledChars}
        </span>
      );
    }
    return <span key={index}>{styledChars}</span>;
  });
};

// --- HAUPT-APP KOMPONENTE ---
export default function App() {
  const MIN_EASE = 1.3;
  const MAX_EASE = 2.8;
  const LEECH_THRESHOLD = 3;
  const LEARNING_STEPS_MS = [10 * 60 * 1000, 24 * 60 * 60 * 1000, 3 * 24 * 60 * 60 * 1000];

  const [vocab, setVocab] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'learn', 'review', 'deck_list', 'free_practice', 'grammar', 'grammar_practice'
  
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('turkishVocabProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  const [xRayMode, setXRayMode] = useState(() => {
    const savedXRay = localStorage.getItem('turkishVocabXRay');
    return savedXRay ? JSON.parse(savedXRay) : false;
  });

  // NEU: Lernrichtung State
  const [learningDirection, setLearningDirection] = useState(() => {
    const savedDir = localStorage.getItem('turkishVocabDirection');
    return savedDir || 'tr-de';
  });
  
  const [currentQueue, setCurrentQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  
  // Grammar State
  const [activeGrammarTopic, setActiveGrammarTopic] = useState(null);
  const [selectedPracticeSectionId, setSelectedPracticeSectionId] = useState(null);
  const [grammarPracticeProgress, setGrammarPracticeProgress] = useState(() => {
    const savedProgress = localStorage.getItem('turkishGrammarPracticeProgressV1');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  useEffect(() => {
    fetch('/vocab.json')
      .then(res => res.json())
      .then(data => {
        setVocab(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Fehler beim Laden der Vokabeln:", err);
        setIsLoading(false);
      });
  }, []);

  const DECK_SIZE = 20; 
  const decks = useMemo(() => {
    const generatedDecks = [];
    for (let i = 0; i < vocab.length; i += DECK_SIZE) {
      const deckNum = Math.floor(i / DECK_SIZE) + 1;
      const minId = i + 1;
      const maxId = Math.min(i + DECK_SIZE, vocab.length);
      generatedDecks.push({
        id: deckNum,
        title: `Deck ${deckNum}`,
        subtitle: `Top ${minId}-${maxId} Wörter`,
        minId,
        maxId
      });
    }
    return generatedDecks;
  }, [vocab]);

  useEffect(() => {
    localStorage.setItem('turkishVocabProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('turkishVocabXRay', JSON.stringify(xRayMode));
  }, [xRayMode]);

  useEffect(() => {
    localStorage.setItem('turkishVocabDirection', learningDirection);
  }, [learningDirection]);

  useEffect(() => {
    localStorage.setItem('turkishGrammarPracticeProgressV1', JSON.stringify(grammarPracticeProgress));
  }, [grammarPracticeProgress]);

  // Hilfsfunktion: Gibt die korrekte ID für den Speicher-Fortschritt zurück
  const getProgressKey = useCallback((id) => {
    return learningDirection === 'de-tr' ? `${id}_rev` : String(id);
  }, [learningDirection]);

  const stats = useMemo(() => {
    const now = Date.now();
    let learned = 0;
    let due = 0;
    
    vocab.forEach(word => {
      const pKey = getProgressKey(word.id);
      const p = progress[pKey];
      if (p) {
        learned++;
        if (p.nextReview <= now) due++;
      }
    });

    const newWords = vocab.length - learned;
    return { learned, due, newWords, total: vocab.length };
  }, [progress, vocab, getProgressKey]);

  // --- ACTIONS ---

  const startLearnSession = () => {
    const newCards = vocab.filter(word => !progress[getProgressKey(word.id)]).slice(0, 5);
    if (newCards.length > 0) {
      setCurrentQueue(newCards);
      setCurrentIndex(0);
      setIsCardFlipped(false);
      setView('learn');
    }
  };

  const startReviewSession = () => {
    const now = Date.now();
    const dueCards = vocab.filter(word => {
      const p = progress[getProgressKey(word.id)];
      return p && p.nextReview <= now;
    }).sort((a, b) => {
      const aData = progress[getProgressKey(a.id)];
      const bData = progress[getProgressKey(b.id)];
      return aData.nextReview - bData.nextReview;
    });
    
    if (dueCards.length > 0) {
      setCurrentQueue(dueCards);
      setCurrentIndex(0);
      setIsCardFlipped(false);
      setView('review');
    }
  };

  const startFreePractice = (deck) => {
    const deckCards = vocab.filter(word => word.id >= deck.minId && word.id <= deck.maxId);
    if (deckCards.length > 0) {
      setCurrentQueue(deckCards);
      setCurrentIndex(0);
      setIsCardFlipped(false);
      setView('free_practice');
    }
  };

  const startGrammarPractice = (sectionId = null) => {
    setSelectedPracticeSectionId(sectionId);
    setView('grammar_practice');
  };

  const openGrammarTheoryFromPractice = (sectionId) => {
    const matchedTopic = GRAMMAR_TOPICS.find(
      (topic) => (topic.practiceSectionId || topic.id) === sectionId,
    );

    if (matchedTopic) {
      setActiveGrammarTopic(matchedTopic.id);
    } else {
      setActiveGrammarTopic(null);
    }
    setView('grammar');
  };

  const handleGrammarPracticeComplete = (sectionId, correct, total) => {
    setGrammarPracticeProgress((prev) => {
      const existing = prev[sectionId] || {
        attempts: 0,
        bestCorrect: 0,
        total,
      };

      return {
        ...prev,
        [sectionId]: {
          attempts: existing.attempts + 1,
          bestCorrect: Math.max(existing.bestCorrect, correct),
          total,
          lastCorrect: correct,
          lastPlayedAt: Date.now(),
        },
      };
    });
  };

  const handleLearnNext = () => {
    const word = currentQueue[currentIndex];
    const pKey = getProgressKey(word.id);
    
    setProgress(prev => ({
      ...prev,
      [pKey]: {
        interval: 0,
        ease: 2.3,
        learningStep: 0,
        failedStreak: 0,
        isLeech: false,
        nextReview: Date.now(),
      }
    }));

    if (currentIndex < currentQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsCardFlipped(false);
    } else {
      setView('dashboard');
    }
  };

  const handleFreePracticeNext = () => {
    if (currentIndex < currentQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsCardFlipped(false);
    } else {
      setView('deck_list');
    }
  };

  const handleReviewAnswer = (quality) => {
    const word = currentQueue[currentIndex];
    const pKey = getProgressKey(word.id);
    const currentData = progress[pKey] || {
      interval: 0,
      ease: 2.3,
      learningStep: null,
      failedStreak: 0,
      isLeech: false,
    };
    let newInterval = currentData.interval;
    let newEase = currentData.ease;
    const failedStreak = currentData.failedStreak || 0;

    // Lernphase: 10min -> 1d -> 3d
    if (currentData.learningStep !== null && currentData.learningStep !== undefined) {
      if (quality === 0) {
        const adjustedEase = Math.max(MIN_EASE, newEase - 0.2);
        setProgress(prev => ({
          ...prev,
          [pKey]: {
            ...currentData,
            interval: 0,
            ease: adjustedEase,
            learningStep: 0,
            failedStreak: failedStreak + 1,
            isLeech: failedStreak + 1 >= LEECH_THRESHOLD,
            nextReview: Date.now() + LEARNING_STEPS_MS[0],
          }
        }));
      } else {
        const nextStep = currentData.learningStep + 1;
        const nextFailedStreak = quality === 2 ? 0 : failedStreak;

        if (nextStep < LEARNING_STEPS_MS.length) {
          setProgress(prev => ({
            ...prev,
            [pKey]: {
              ...currentData,
              ease: quality === 2 ? Math.min(MAX_EASE, newEase + 0.05) : newEase,
              learningStep: nextStep,
              failedStreak: nextFailedStreak,
              isLeech: false,
              nextReview: Date.now() + LEARNING_STEPS_MS[nextStep],
            }
          }));
        } else {
          const graduatedInterval = quality === 2 ? 4 : 3;
          setProgress(prev => ({
            ...prev,
            [pKey]: {
              ...currentData,
              interval: graduatedInterval,
              ease: quality === 2 ? Math.min(MAX_EASE, newEase + 0.1) : newEase,
              learningStep: null,
              failedStreak: nextFailedStreak,
              isLeech: false,
              nextReview: Date.now() + (graduatedInterval * 24 * 60 * 60 * 1000),
            }
          }));
        }
      }

      if (currentIndex < currentQueue.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsCardFlipped(false);
      } else {
        setView('dashboard');
      }
      return;
    }

    if (quality === 0) {
      newInterval = 0;
      newEase = Math.max(MIN_EASE, newEase - 0.2);
    } else if (quality === 1) {
      newInterval = newInterval === 0 ? 1 : newInterval * 2;
      newEase = Math.max(MIN_EASE, newEase - 0.02);
    } else if (quality === 2) {
      newInterval = newInterval === 0 ? 3 : Math.ceil(newInterval * newEase);
      newEase = Math.min(MAX_EASE, newEase + 0.15);
    }

    const nextReview = Date.now() + (newInterval * 24 * 60 * 60 * 1000); 
    
    setProgress(prev => ({
      ...prev,
      [pKey]: {
        ...currentData,
        interval: newInterval,
        ease: newEase,
        failedStreak: quality === 0 ? failedStreak + 1 : 0,
        isLeech: quality === 0 ? failedStreak + 1 >= LEECH_THRESHOLD : false,
        nextReview: quality === 0 ? Date.now() : nextReview,
      }
    }));

    if (currentIndex < currentQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsCardFlipped(false);
    } else {
      setView('dashboard');
    }
  };

  // --- VIEWS ---

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans selection:bg-indigo-200 overflow-hidden">
      <div className="w-full max-w-md mx-auto">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
            <BrainCircuit className="w-12 h-12 text-indigo-400 animate-pulse mb-4" />
            <p>Lade App-Daten...</p>
          </div>
        ) : (
          <>
            {view === 'dashboard' && (
              <DashboardView
                learningDirection={learningDirection}
                setLearningDirection={setLearningDirection}
                stats={stats}
                startLearnSession={startLearnSession}
                startReviewSession={startReviewSession}
                setView={setView}
                setActiveGrammarTopic={setActiveGrammarTopic}
                startGrammarPractice={startGrammarPractice}
                xRayMode={xRayMode}
                setXRayMode={setXRayMode}
              />
            )}
            {view === 'deck_list' && (
              <DeckListView
                decks={decks}
                startFreePractice={startFreePractice}
                setView={setView}
              />
            )}
            {view === 'grammar' && (
              <GrammarView
                activeGrammarTopic={activeGrammarTopic}
                setActiveGrammarTopic={setActiveGrammarTopic}
                setView={setView}
                grammarTopics={GRAMMAR_TOPICS}
                startGrammarPractice={startGrammarPractice}
              />
            )}
            {view === 'grammar_practice' && (
              <GrammarPracticeView
                sections={GRAMMAR_PRACTICE_SECTIONS}
                progress={grammarPracticeProgress}
                onCompleteSection={handleGrammarPracticeComplete}
                setView={setView}
                initialSectionId={selectedPracticeSectionId}
                onOpenTheoryForSection={openGrammarTheoryFromPractice}
              />
            )}
            {(view === 'learn' || view === 'review' || view === 'free_practice') && (
              <FlashcardView
                view={view}
                currentQueue={currentQueue}
                currentIndex={currentIndex}
                progress={progress}
                getProgressKey={getProgressKey}
                isCardFlipped={isCardFlipped}
                setIsCardFlipped={setIsCardFlipped}
                learningDirection={learningDirection}
                xRayMode={xRayMode}
                handleLearnNext={handleLearnNext}
                handleFreePracticeNext={handleFreePracticeNext}
                handleReviewAnswer={handleReviewAnswer}
                setView={setView}
                formatTurkishText={formatTurkishText}
              />
            )}
          </>
        )}

      </div>
    </div>
  );
}