import React from 'react';

const exampleList = (items) => (
  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
    {items.map((item) => (
      <li key={item}><span className="font-mono text-slate-800 dark:text-slate-100">{item.split(' - ')[0]}</span> - {item.split(' - ').slice(1).join(' - ')}</li>
    ))}
  </ul>
);

export const GRAMMAR_TOPICS = [
  {
    id: 'a1-grammatik-fundament',
    practiceSectionId: 'a1-grammatik-fundament',
    title: '1. Satzbau, Pronomen und Nominalsatz',
    subtitle: 'Grundstruktur von A1 (A1)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Der neutrale türkische Satz folgt meist der Reihenfolge <strong>Subjekt - Objekt - Verb (SOV)</strong>. Dazu kommen die Personalpronomen und einfache Nominalsätze ohne separates "sein".</p>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
          <p className="font-semibold mb-2">Kernregeln</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Verb steht in neutralen Aussagen typischerweise am Ende.</li>
            <li>"O" bedeutet er/sie/es (kein grammatisches Geschlecht).</li>
            <li>Nominalsätze bilden wir mit Endungen: <span className="font-mono">öğretmen-im</span> (ich bin Lehrer).</li>
          </ul>
        </div>
        {exampleList([
          'Ben kitap okuyorum. - Ich lese ein Buch.',
          'Sen öğrencisin. - Du bist Schüler/Student.',
          'O doktor. - Er/Sie ist Arzt/Ärztin.',
          'Biz evdeyiz. - Wir sind zu Hause.',
          'Onlar Türkiye\'de. - Sie sind in der Türkei.',
        ])}
      </div>
    ),
  },
  {
    id: 'a1-vokalharmonie-konsonanten',
    practiceSectionId: 'a1-vokalharmonie-konsonanten',
    title: '2. Vokalharmonie und Konsonantenregeln',
    subtitle: 'Suffixe korrekt anpassen (A1)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Die meisten Endungen folgen der Vokalharmonie. Dazu kommen Konsonantenprozesse wie Erweichung (p-b, t-d, k-ğ/g, ç-c) und Verhärtung (d-t) in bestimmten Kontexten.</p>
        <div className="grid gap-3 text-sm">
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-xl">2-Wege: <span className="font-mono">-lar/-ler, -da/-de</span></div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl">4-Wege: <span className="font-mono">mı/mi/mu/mü, -(y)ı/(y)i/(y)u/(y)ü</span></div>
        </div>
        {exampleList([
          'ev-ler - Häuser',
          'araba-lar - Autos',
          'köpek-i -> köpeğ-i - den Hund (Akk.)',
          'kitap-ı -> kitab-ı - das Buch (Akk.)',
          'sokak-da -> sokak-ta - auf der Straße',
        ])}
      </div>
    ),
  },
  {
    id: 'a1-kasus',
    practiceSectionId: 'a1-kasus',
    title: '3. Die wichtigsten Fälle',
    subtitle: 'Ort, Richtung, Herkunft, Objekt (A1-A2)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Kasus werden über Suffixe markiert. Für A1/A2 sind vor allem Lokativ, Dativ, Ablativ und Akkusativ zentral.</p>
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-sm">
          <p><strong>Lokativ</strong>: -de/-da (Wo?)</p>
          <p><strong>Dativ</strong>: -e/-a (Wohin?)</p>
          <p><strong>Ablativ</strong>: -den/-dan (Woher?)</p>
          <p><strong>Akkusativ</strong>: -(y)i/-(y)ı/-(y)u/-(y)ü (bestimmtes Objekt)</p>
        </div>
        {exampleList([
          'Okul-da bekliyorum. - Ich warte in der Schule.',
          'Okul-a gidiyorum. - Ich gehe zur Schule.',
          'Okul-dan geliyorum. - Ich komme von der Schule.',
          'Kitab-ı okuyorum. - Ich lese das Buch.',
          'Ali\'ye yazdım. - Ich habe Ali geschrieben.',
        ])}
      </div>
    ),
  },
  {
    id: 'a2-besitz-izafet',
    practiceSectionId: 'a2-besitz-izafet',
    title: '4. Besitz, Genitiv und Izafet',
    subtitle: 'Zugehörigkeit präzise ausdrücken (A2)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Im Türkischen markiert man Besitz oft doppelt: Besitzer im Genitiv und Besitz mit Possessivsuffix.</p>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/40">
          <p className="font-mono text-center">Besitzer-(n)in + Besitz-(s)i</p>
        </div>
        {exampleList([
          'Benim araba-m var. - Ich habe mein Auto.',
          'Ev-in kapı-sı açık. - Die Haustür ist offen.',
          'Öğretmen-in kitap-ı yeni. - Das Buch des Lehrers ist neu.',
          'Biz-im okul-umuz büyük. - Unsere Schule ist groß.',
          'Çocuk-lar-ın oda-sı temiz. - Das Zimmer der Kinder ist sauber.',
        ])}
      </div>
    ),
  },
  {
    id: 'a2-simdiki-aorist',
    practiceSectionId: 'a2-simdiki-aorist',
    title: '5. Gegenwart und Aorist',
    subtitle: '-yor und Aorist korrekt verwenden (A2)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p><strong>Şimdiki Zaman (-yor)</strong> beschreibt gerade laufende Prozesse. Der <strong>Aorist</strong> drückt Gewohnheiten, allgemeine Aussagen und teils Zukunftsnuancen aus.</p>
        {exampleList([
          'Şimdi çalışıyor-um. - Ich arbeite gerade.',
          'Her gün erken kalkar-ım. - Ich stehe jeden Tag früh auf.',
          'Akşam ne yapıyor-sun? - Was machst du heute Abend?',
          'Kahve iç-er misin? - Trinkst du (gern) Kaffee?',
          'Genelde otobüs kullan-ır-ız. - Normalerweise nutzen wir den Bus.',
        ])}
      </div>
    ),
  },
  {
    id: 'a2-b1-vergangenheit',
    practiceSectionId: 'a2-b1-vergangenheit',
    title: '6. Vergangenheit: -di und -miş',
    subtitle: 'Erlebt vs. berichtet (A2-B1)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p><strong>-di</strong> steht meist für direkt erfahrene Fakten, <strong>-miş</strong> für berichtete/erschlossene Information oder erzählerische Distanz.</p>
        {exampleList([
          'Dün geldim. - Ich bin gestern gekommen.',
          'Toplantı erken bitmiş. - Das Meeting ist wohl früh zu Ende gegangen.',
          'Filmi izledik. - Wir haben den Film gesehen.',
          'O taşınmış. - Er/Sie ist (anscheinend) umgezogen.',
          'Sınav zor-du. - Die Prüfung war schwer.',
        ])}
      </div>
    ),
  },
  {
    id: 'b1-zukunft-und-pflicht',
    practiceSectionId: 'b1-zukunft-und-pflicht',
    title: '7. Zukunft, Absicht und Notwendigkeit',
    subtitle: '-ecek, -malı/-meli, zorunda (B1)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Für B1 sind Zukunftsplanung und Verpflichtung wichtig: <strong>-ecek/-acak</strong>, <strong>-malı/-meli</strong> und periphrastische Formen wie <strong>zorunda</strong>.</p>
        {exampleList([
          'Yarın çalışacak-ım. - Ich werde morgen arbeiten.',
          'Daha dikkatli olmalı-sın. - Du solltest vorsichtiger sein.',
          'Bugün erken çıkmak zorunda-yım. - Ich muss heute früh los.',
          'Haftaya görüşecek-iz. - Wir werden uns nächste Woche sehen.',
          'Bu raporu bitirmeli-yiz. - Wir müssen diesen Bericht fertigstellen.',
        ])}
      </div>
    ),
  },
  {
    id: 'b1-modalitaet',
    practiceSectionId: 'b1-modalitaet',
    title: '8. Modalität und Fähigkeit',
    subtitle: '-(y)ebil, istemek, gerek (B1)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Mit Modalstrukturen kann man Fähigkeit, Erlaubnis, Wunsch und Notwendigkeit differenziert ausdrücken.</p>
        {exampleList([
          'Türkçe konuşabil-ir-im. - Ich kann Türkisch sprechen.',
          'Burada bekleyebilir misin? - Kannst du hier warten?',
          'Gitmek istiyor-um. - Ich möchte gehen.',
          'Daha çok pratik yapmak gerek. - Man muss mehr üben.',
          'Bunu tek başıma yapamam. - Das kann ich nicht allein machen.',
        ])}
      </div>
    ),
  },
  {
    id: 'b1-negation-fragen',
    practiceSectionId: 'b1-negation-fragen',
    title: '9. Verneinung und Fragestrategien',
    subtitle: 'değil, -ma/-me, mı/mi und Fragewörter (A2-B1)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Verneinung betrifft verschiedene Ebenen: Nominalprädikat (<strong>değil</strong>), Verb (<strong>-ma/-me</strong>) und Existenz (<strong>yok</strong>).</p>
        {exampleList([
          'Hasta değil-im. - Ich bin nicht krank.',
          'Gelmiyor-um. - Ich komme nicht (gerade).',
          'Evde kimse yok. - Niemand ist zu Hause.',
          'Ne zaman geliyorsun? - Wann kommst du?',
          'Bu doğru mu? - Ist das richtig?',
        ])}
      </div>
    ),
  },
  {
    id: 'b1-postpositionen',
    practiceSectionId: 'b1-postpositionen',
    title: '10. Postpositionen und Raumrelationen',
    subtitle: 'için, gibi, sonra, önce, kadar, ile (B1)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Türkisch nutzt häufig Postpositionen statt Präpositionen. Viele verlangen bestimmte Kasusformen oder feste Muster.</p>
        {exampleList([
          'Senin için geldim. - Ich bin für dich gekommen.',
          'Babam gibi konuşuyor. - Er/Sie spricht wie mein Vater.',
          'Dersten sonra buluşalım. - Treffen wir uns nach dem Unterricht.',
          'Saat beşe kadar çalışacağım. - Ich werde bis fünf Uhr arbeiten.',
          'Arkadaşım ile geldim. - Ich bin mit meinem Freund gekommen.',
        ])}
      </div>
    ),
  },
  {
    id: 'b1-b2-relativsaetze',
    practiceSectionId: 'b1-b2-relativsaetze',
    title: '11. Relativsätze mit Partizipien',
    subtitle: '-(y)an und -dik/-ecek Strukturen (B1-B2)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Statt Relativpronomen bildet Türkisch Relativkonstruktionen über Partizipien. Das ist ein Kernschritt von B1 zu B2.</p>
        {exampleList([
          'Gelen adam kardeşim. - Der Mann, der kommt, ist mein Bruder.',
          'Okuyan kız çok çalışkan. - Das Mädchen, das liest, ist fleißig.',
          'Okuduğum kitap çok ilginç. - Das Buch, das ich lese/gelesen habe, ist interessant.',
          'Gideceğimiz yer uzak. - Der Ort, wohin wir gehen werden, ist weit.',
          'Seni arayan kişi burada. - Die Person, die dich angerufen hat, ist hier.',
        ])}
      </div>
    ),
  },
  {
    id: 'b2-zarf-fiiller',
    practiceSectionId: 'b2-zarf-fiiller',
    title: '12. Adverbialsätze (Zarf-Fiiller)',
    subtitle: '-ince, -ken, -ip, -erek, -dikçe (B2)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Auf B2-Niveau verbindet man Teilsätze elegant über Gerundial-/Adverbialformen statt nur mit einfachen Konjunktionen.</p>
        {exampleList([
          'Eve gelince beni ara. - Ruf mich an, sobald du nach Hause kommst.',
          'Yürürken müzik dinliyorum. - Ich höre Musik, während ich laufe.',
          'Markete gidip döndüm. - Ich ging zum Markt und kam zurück.',
          'Gülerek konuştu. - Er/Sie sprach lachend.',
          'Çalıştıkça gelişiyorsun. - Je mehr du arbeitest, desto mehr entwickelst du dich.',
        ])}
      </div>
    ),
  },
  {
    id: 'b2-verbvoice',
    practiceSectionId: 'b2-verbvoice',
    title: '13. Verbdiathese: Passiv, Kausativ, Reflexiv, Reziprok',
    subtitle: 'Handlungsrollen verändern (B2)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Durch Verbableitungen kann man Täter, Betroffene und Verursachung präzise steuern.</p>
        {exampleList([
          'Kapı açıldı. - Die Tür wurde geöffnet.',
          'Arabayı tamir ettirdim. - Ich ließ das Auto reparieren.',
          'Çocuk giyindi. - Das Kind hat sich angezogen.',
          'Yarın görüşeceğiz. - Wir werden uns morgen sehen/treffen.',
          'Toplantı ertelendi. - Das Meeting wurde verschoben.',
        ])}
      </div>
    ),
  },
  {
    id: 'b2-nominalisierung-dolayli-anlatim',
    practiceSectionId: 'b2-nominalisierung-dolayli-anlatim',
    title: '14. Nominalisierung und indirekte Rede',
    subtitle: '-dik/-ecek + Possessiv + Kasus (B2)',
    content: (
      <div className="space-y-5 text-slate-700 dark:text-slate-300">
        <p>Komplexe Inhalte ("dass...", "ob...") werden oft nominalisiert. Diese Strukturen sind zentral für akademischeres B2-Türkisch.</p>
        {exampleList([
          'Geleceğini biliyorum. - Ich weiß, dass du kommen wirst.',
          'Hasta olduğunu söyledi. - Er/Sie sagte, dass er/sie krank ist.',
          'Sınavın zor olduğunu düşünüyorum. - Ich denke, dass die Prüfung schwer ist.',
          'Ne istediğini anlamadım. - Ich habe nicht verstanden, was du willst.',
          'Toplantıya katılıp katılmayacağını sordu. - Er/Sie fragte, ob du am Meeting teilnimmst.',
        ])}
      </div>
    ),
  },
];

