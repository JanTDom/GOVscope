import { NextResponse } from 'next/server';

interface AuditRequestBody {
  officialName?: string;
  roleTitle?: string;
  ministryCode?: string;
  coalitionParty?: string;
  topic?: string;
  sourceMedium?: string;
  statementText?: string;
}

export async function POST(req: Request) {
  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.PPGSCOPE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Brak skonfigurowanego klucza GEMINI_API_KEY w środowisku serwera KPRM.',
        },
        { status: 500 }
      );
    }

    const body: AuditRequestBody = await req.json();

    const officialName = body.officialName?.trim() || 'Członek Rady Ministrów';
    const roleTitle = body.roleTitle?.trim() || 'Minister';
    const ministryCode = body.ministryCode?.trim() || 'KPRM';
    const coalitionParty = body.coalitionParty?.trim() || 'Koalicja 15 Października';
    const topic = body.topic?.trim() || 'Spójność komunikacyjna rządu';
    const sourceMedium = body.sourceMedium?.trim() || 'Wywiad poranny / oświadczenie';
    const statementText = body.statementText?.trim();

    if (!statementText || statementText.length < 10) {
      return NextResponse.json(
        { error: 'Treść wypowiedzi do audytu jest zbyt krótka (wymagane minimum 10 znaków).' },
        { status: 400 }
      );
    }

    const systemPrompt = `Jesteś głównym analitykiem spójności rządowej i radarem ryzyka narracyjnego w systemie GOVscope dla Kancelarii Prezesa Rady Ministrów (KPRM) oraz Ministra ds. Unii Europejskiej.

Twoje zadanie:
Bezlitośnie i precyzyjnie audytujesz wypowiedzi członków rządu, zapowiedzi medialne oraz projekty ustaw pod kątem:
1. Rozbieżności ze stanowiskiem premiera Donalda Tuska oraz expose rządu.
2. Kakofonii resortowej i sporów w koalicji rządowej (KO, PSL, Polska 2050, Nowa Lewica).
3. Przedwczesnych deklaracji bez uzgodnienia na Stałym Komitecie Rady Ministrów (SKRM) i z Ministrem Finansów (Andrzej Domański).
4. Kolizji z polityką europejską (kamienie milowe KPO, procedura nadmiernego deficytu, unijne dyrektywy).
5. Paliwa medialnego dla opozycji.

Standard inżynieryjny i redakcyjny (Fable 5.1):
- Język twardy, urzędowy, analityczny, po polsku. Zero waty słownej, zero frazesów typu "Warto zauważyć", "Kluczowym aspektem jest".
- Poprawne polskie skrótowce: KPRM, CIR, SKRM, MF, MSZ, MON, MSWiA, MS, MAP, MRiT, MKiŚ, MRPiPS, MZ, MEN, MI, MC, MFiPR, TK, SN, KRS, UE, KPO, PAP.
- Zwracaj wyłącznie poprawny obiekt JSON.`;

    const userPrompt = `Dokonaj natychmiastowego audytu spójności rządowej dla poniższego materiału.

METADANE AUTORA:
- Imię i nazwisko: ${officialName}
- Funkcja: ${roleTitle}
- Resort: ${ministryCode}
- Partia koalicyjna: ${coalitionParty}
- Temat: ${topic}
- Źródło / medium: ${sourceMedium}

TREŚĆ MATERIAŁU:
"""
${statementText}
"""

Zwróć poprawny JSON o następującej strukturze pól:
{
  "overall_risk_score": <liczba od 0.0 do 10.0, np. 8.4>,
  "severity": <jeden z: "P1_CRITICAL" | "P2_HIGH" | "P3_MODERATE" | "LOW">,
  "category": <jeden z: "KAKOFONIA_RESORTOWA" | "BALON_PRÓBNY" | "SPRZECZNOŚĆ_Z_EXPOSE" | "NAPIĘCIE_KOALICYJNE" | "ROZDŹWIĘK_Z_BRUKSELĄ" | "BŁĄD_W_WYWIADZIE">,
  "coalition_friction": <true/false>,
  "friction_axis": "<np. KO vs PSL lub MF vs MRiT lub 'Brak - stanowisko jednolite'>",
  "affected_ministries": ["<np. MF>", "<np. MRiT>"],
  "conflict_summary": "<krótkie, bezkompromisowe podsumowanie sedna sprzeczności w 1-2 zdaniach>",
  "prime_minister_impact": "<precyzyjna analiza, w jaki sposób to oświadczenie uderza w pozycję premiera i rządu>",
  "recommended_cir_directive": "<konkretna, bezwzględna instrukcja przekazu dla rzecznika rządu i Centrum Informacyjnego Rządu (CIR)>",
  "skrm_status": "<ocena zgodności z procedurą rządową, np. 'Wymaga pilnego uzgodnienia na SKRM' lub 'Zgodne z harmonogramem rządu'>"
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Błąd komunikacji z Google Gemini API: ${response.status}`, details: errText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json(
        { error: 'Model Gemini nie zwrócił poprawnej odpowiedzi tekstowej.' },
        { status: 502 }
      );
    }

    const parsedAudit = JSON.parse(rawContent);

    return NextResponse.json({
      status: 'ok',
      audit: parsedAudit,
      engine: 'Google Gemini 2.5 Flash / GOVscope Cohesion Engine',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Nieznany błąd';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
