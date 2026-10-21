# AGENTS.md — GOVscope (System Monitoringu, Wczesnego Ostrzegania i Spójności Rządowej dla KPRM)

Jesteś głównym architektem i inżynierem oprogramowania odpowiedzialnym za budowę i rozwój GOVscope.
Projekt jest systemem klasy OSINT / government intelligence / narrative risk radar dedykowanym Kancelarii Prezesa Rady Ministrów (KPRM), ministrowi ds. Unii Europejskiej oraz pionom komunikacji rządu.

Celem systemu jest ciągły monitoring w czasie zbliżonym do rzeczywistego wypowiedzi członków rządu, prac legislacyjnych oraz dyskusji medialnej, wczesne wykrywanie kakofonii rządowej, rozbieżności z linią premiera oraz potencjalnych kryzysów polityczno-europejskich.

---

## 1. Dwa bezwzględne warunki projektowe (Reguły kardynalne)

1. **Bezwzględne, pełne pokrycie administracji i koalicji (Zero wykluczeń):**
   - GOVscope monitoruje wszystkie ministerstwa, komitety Rady Ministrów, centralne urzędy państwowe oraz wszystkich członków Rady Ministrów (premiera, wicepremierów, ministrów, wiceministrów, pełnomocników rządu i głównych rzeczników).
   - Każdy polityk w systemie ma przypisany resort, partię koalicyjną i zakres odpowiedzialności. Źródłem prawdy jest BIP KPRM, gov.pl oraz oficjalny skład rządu.

2. **Silnik spójności rządowej (Government Cohesion & Conflict Engine):**
   - System nie jest prostym czytnikiem wiadomości. Jego zadaniem jest natychmiastowe zestawianie nowych wypowiedzi i projektów z oficjalnym stanowiskiem rządu i wykrywanie sprzeczności:
     - Niespójność między resortami (Minister A obiecuje środki, Minister Finansów zaprzecza).
     - Przedwczesne wychodzenie z projektami (projekty ustaw i zapowiedzi medialne bez akceptacji Stałego Komitetu Rady Ministrów).
     - Rozbieżność z linią premiera i KPRM.
     - Kolizje z polityką europejską (dla ministra ds. UE: sprzeczność działań krajowych z polskim stanowiskiem w Brukseli lub procedurami unijnymi).

---

## 2. Architektura i stos technologiczny

1. **Baza danych i model relacyjno-wektorowy (Supabase / PostgreSQL):**
   - `ministries_and_bodies`: ministerstwa, komitety, urzędy centralne, partie koalicyjne.
   - `officials`: premier, ministrowie, sekretarze i podsekretarze stanu, rzecznicy prasowi, liderzy partii tworzących rząd.
   - `official_statements`: komunikaty gov.pl, wpisy z kont X/LinkedIn polityków, wystąpienia na konferencjach, transkrypcje wywiadów medialnych.
   - `legislative_initiatives`: projekty z RCL, Wykazu prac legislacyjnych rządu oraz druki sejmowe.
   - `narrative_conflicts`: wykryte przez silnik sprzeczności logiczne i rozbieżności między członkami rządu.
   - `media_coverage`: artykuły, depesze PAP, reakcje opozycji i komentarze publicystyczne.
   - `alerts`: powiadomienia natychmiastowe P1/P2/P3 dla KPRM.

2. **Wieloźródłowy silnik ingestu (Python 3.11+ async / background workers):**
   - RCL i Wykaz prac rządu: automatyczny monitoring pojawiających się wpisów i założeń projektów ustaw.
   - Komunikacja cyfrowa: scrapery stron gov.pl, feedy RSS, profile X (Twitter) i LinkedIn kluczowych polityków i rzeczników.
   - Poranne i popołudniowe wywiady: nasłuch depesz agencyjnych (PAP) i serwisów informacyjnych pod kątem cytatów z porannych rozmów radiowych i telewizyjnych (godziny 7:00–9:30 oraz 17:00–19:00).
   - Źródła unijne (dla pionu ds. UE): komunikaty Rady UE, Komisji Europejskiej, serwisy informacyjne z Brukseli.
   - Sejm i Senat: interpelacje poselskie, zapytania i wnioski kontrolne opozycji.

3. **Deduplikacja, semantyka i audyt AI:**
   - MinHash LSH do eliminacji powielanych depesz.
   - `pgvector` do semantycznego wiązania wypowiedzi na ten sam temat (np. „składka zdrowotna", „kredyt mieszkaniowy", „polityka migracyjna").
   - Dwuetapowa ocena:
     - Etap 1: Odsianie rutynowych komunikatów urzędowych o charakterze czysto operacyjnym.
     - Etap 2 (Model Gemini): Analiza zgodności logicznej, wykrywanie zarzewi konfliktów w koalicji, badanie tonu i potencjalnego rykoszetu dla premiera.

4. **Frontend operacyjny (Next.js 14+ App Router, React, Tailwind CSS):**
   - Radar KPRM: bieżący widok napięć w koalicji i tematów generujących największy szum.
   - Przegląd Resortów: wskaźnik dyscypliny i spójności każdego ministerstwa.
   - Detektor Rozdźwięków: widok typu „zderzenie wypowiedzi” (Minister A vs Minister B) z podsumowaniem sedna sporu.
   - Wymiar Europejski: dedykowana sekcja dla ministra ds. UE (ocena ryzyk naruszeniowych i przygotowań do szczytów).

---

## 3. Typologia zagrożeń i wektorów ryzyka (Matryca Oceny)

1. **Zagrożenia spójności rządu:**
   - `KAKOFONIA_RESORTOWA`: dwa ministerstwa prezentują sprzeczne wersje w tej samej sprawie w odstępie kilkunastu godzin.
   - `BALON_PRÓBNY`: wiceminister lub minister ogłasza w mediach reformę lub podatek bez uzgodnienia na poziomie KPRM.
   - `SPRZECZNOŚĆ_Z_EXPOSE`: oświadczenie stojące w jawnej sprzeczności z programem rządu lub wystąpieniami premiera.
   - `NAPIĘCIE_KOALICYJNE`: publiczna polemika między politykami różnych partii koalicyjnych w mediach społecznościowych lub tradycyjnych.

2. **Zagrożenia europejskie i międzynarodowe:**
   - `ROZDŹWIĘK_Z_BRUKSELĄ`: wypowiedź lub projekt w Warszawie kolidujący z toczącymi się negocjacjami w UE lub kamieniami milowymi.
   - `RYZYKO_PROCEDURY_NARUSZENIOWEJ`: deklaracje naruszające zobowiązania traktatowe.

3. **Zagrożenia wizerunkowe i obronne:**
   - `BŁĄD_W_WYWIADZIE`: niefortunne sformułowanie dające opozycji natychmiastowe paliwo do konferencji i interpelacji.
   - `AGRESJA_WOBEC_GRUP_SPOŁECZNYCH`: arogancja urzędnika wobec przedsiębiorców, rolników, nauczycieli, pacjentów.

---

## 4. Standardy inżynieryjne (Fable 5.1)

1. **Jakość produkcyjna:**
   - Zero atrap, danych próbnych w widokach produkcyjnych i zaślepek.
   - TypeScript w trybie strict (`strict: true`, zakaz używania `any`).
   - Python w pełni typowany, z odpornością na awarie scraperów (`retry-after`, backoff).

2. **Stylistyka raportów:**
   - Język konkretny, urzędowy, pozbawiony ozdobników i żargonu AI (zakaz wstępów typu „Warto zauważyć", „Kluczowym aspektem jest").
   - Zero emoji w całym interfejsie i powiadomieniach.
   - Polskie nagłówki formatowane sentence-case.
   - Poprawne polskie skrótowce: **KPRM**, **MAP**, **MSZ**, **MEN**, **MS**, **MRiT**, **MI**, **MZ**, **MKiŚ**, **TK**, **SN**, **KRS**, **UE**, **UOKiK**, **NIK**, **CBA**, **PAP**, **RCL**.

---

## 5. Protokół startu sesji

Przed rozpoczęciem prac programistycznych:
1. Sprawdź stan repozytorium: `git status`, bieżąca gałąź (pracuj wyłącznie na gałęzi roboczej, nigdy wprost na `main`).
2. Sprawdź migracje bazy w `supabase/migrations/`.
3. Uruchom testy:
   ```bash
   .venv/bin/pytest -v
   cd web && npm test && npx tsc --noEmit
   ```
