"""Government Cohesion & Conflict Engine.

Analyzes official statements, legislative announcements, and coalition statements
against the official government line, KPRM directives, and EU policies.
"""

from __future__ import annotations

import re
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple
from uuid import UUID

from govscope.models.entities import (
    Alert,
    ConflictType,
    LegislativeInitiative,
    LegislativeStage,
    NarrativeConflict,
    Official,
    OfficialStatement,
    ResolutionStatus,
    RoleCategory,
    Severity,
    SourceType,
    TargetAudience,
)

# Regex patterns for Stage 1: Routine / Operational message filtering
ROUTINE_PATTERNS = [
    r"\bżyczenia\s+z\s+okazji\b",
    r"\bobchody\s+dnia\b",
    r"\bwręczenie\s+odznaczeń\b",
    r"\bnabór\s+wniosków\s+o\s+dofinansowanie\b",
    r"\bogłoszono\s+konkurs\s+ofert\b",
    r"\bposiedzenie\s+zespołu\s+roboczego\b",
    r"\bspotkanie\s+kurtuazyjne\b",
    r"\bharmonogram\s+pracy\s+urzędu\b",
    r"\bprace\s+konserwacyjne\s+systemu\b",
    r"\bzmiana\s+godzin\s+otwarcia\b",
]

# Sensitive topic vectors that require high vigilance
POLICY_TOPICS = [
    "składka zdrowotna",
    "kredyt mieszkaniowy",
    "kredyt 0%",
    "polityka migracyjna",
    "pakt migracyjny",
    "podatki",
    "budżet",
    "deficyt",
    "zielony ład",
    "ets2",
    "kpo",
    "kamienie milowe",
    "wymiar sprawiedliwości",
    "praworządność",
    "aborcja",
    "związki partnerskie",
    "reforma szpitali",
    "cpk",
    "elektrownia jądrowa",
]

POLICY_TOPIC_VARIANTS: Dict[str, Tuple[str, ...]] = {
    "pakt migracyjny": ("pakt migrac", "paktu migrac", "pakcie migrac"),
    "polityka migracyjna": ("polityk migrac",),
    "składka zdrowotna": ("składk zdrowot",),
    "wymiar sprawiedliwości": ("wymiar sprawied",),
    "praworządność": ("praworząd",),
}


class CohesionEngine:
    """Evaluates narrative coherence against the current Prime Minister line and government policy."""

    def __init__(
        self,
        expose_commitments: Optional[List[Dict[str, Any]]] = None,
        prime_minister_statements: Optional[List[OfficialStatement]] = None,
    ) -> None:
        # Exposé commitments remain a durable reference point, but are not the
        # definition of the Prime Minister's current line. Current statements
        # always take precedence when a matching, recent source exists.
        self.expose_commitments = expose_commitments or [
            {
                "topic": "polityka migracyjna",
                "core_line": "Polska nie przyjmie relokacji migrantów w ramach paktu migracyjnego.",
                "keywords": ["pakt migracyjny", "relokacja", "migracja"],
            },
            {
                "topic": "składka zdrowotna",
                "core_line": "Obniżenie obciążeń dla drobnych przedsiębiorców z zachowaniem stabilności NFZ.",
                "keywords": ["składka zdrowotna", "przedsiębiorcy", "nfz"],
            },
            {
                "topic": "wymiar sprawiedliwości",
                "core_line": "Przywrócenie praworządności w pełnej zgodzie ze standardami unijnymi i konstytucją.",
                "keywords": ["praworządność", "krs", "sn", "kamienie milowe"],
            },
        ]
        self.prime_minister_statements = prime_minister_statements or []

    @staticmethod
    def _matching_topics(text: str) -> List[str]:
        lowered = text.lower()
        return [
            topic
            for topic in POLICY_TOPICS
            if topic in lowered or any(variant in lowered for variant in POLICY_TOPIC_VARIANTS.get(topic, ()))
        ]

    @staticmethod
    def _contradiction_reason(first: str, second: str) -> Optional[str]:
        markers = [
            ("jest finansowanie", "nie ma środków"),
            ("zostanie wprowadzone", "nie ma mowy"),
            ("popieramy", "stanowczy sprzeciw"),
            ("będzie kredyt 0%", "nie poprzemy kredytu 0%"),
            ("obniżymy składkę", "nie ma zgody na obniżenie"),
            ("zgoda rządu", "brak uzgodnienia"),
            ("przyjmiemy", "nie przyjmiemy"),
            ("przyjmie", "nie przyjmie"),
            ("wdrożymy", "nie wdrożymy"),
        ]
        first_lower = first.lower()
        second_lower = second.lower()
        for positive, negative in markers:
            if (positive in first_lower and negative in second_lower) or (
                negative in first_lower and positive in second_lower
            ):
                return f"Zderzenie stanowisk: '{positive}' vs '{negative}'"
        return None

    def evaluate_against_prime_minister_line(
        self,
        statement: OfficialStatement,
        official: Official,
        prime_minister_statements: Optional[List[OfficialStatement]] = None,
        reference_window_days: int = 90,
    ) -> Optional[NarrativeConflict]:
        """Compares a government statement with the PM's current public line.

        The exposé is only a fallback when no recent PM statement addresses the
        same topic. This prevents a stale programme document from overriding
        the Prime Minister's later, source-backed public position.
        """
        if official.role_category == RoleCategory.PREMIER:
            return None

        candidates = prime_minister_statements if prime_minister_statements is not None else self.prime_minister_statements
        topics = self._matching_topics(statement.content)
        if not topics:
            return None

        recent_pm_statements = [
            pm_statement
            for pm_statement in candidates
            if abs(statement.published_at - pm_statement.published_at) <= timedelta(days=reference_window_days)
            and any(topic in self._matching_topics(pm_statement.content) for topic in topics)
        ]

        baseline_statement: Optional[OfficialStatement] = None
        baseline_label = "CURRENT_PRIME_MINISTER_STATEMENTS"
        reason: Optional[str] = None
        if recent_pm_statements:
            baseline_statement = max(recent_pm_statements, key=lambda item: item.published_at)
            reason = self._contradiction_reason(statement.content, baseline_statement.content)
        else:
            # Preserve the historic programme baseline as a secondary source.
            # It is explicitly labelled so downstream reports cannot confuse it
            # with a current PM statement.
            lowered = statement.content.lower()
            for commitment in self.expose_commitments:
                if any(keyword in lowered for keyword in commitment["keywords"]):
                    baseline_label = "EXPOSE_FALLBACK"
                    if any(
                        positive in lowered and negative in commitment["core_line"].lower()
                        for positive, negative in [("nie przyjmiemy", "przyjmie"), ("nie wdrożymy", "wdrożenie")]
                    ):
                        reason = f"Wypowiedź odbiega od zobowiązania programowego: {commitment['core_line']}"
                    break

        if reason is None:
            return None

        topic = topics[0]
        return NarrativeConflict(
            conflict_type=ConflictType.SPRZECZNOSC_Z_EXPOSE,
            severity=Severity.P1_CRITICAL if baseline_label == "CURRENT_PRIME_MINISTER_STATEMENTS" else Severity.P2_HIGH,
            title=f"Sprzeczność z linią premiera: {topic}",
            summary=(
                f"Wypowiedź {official.full_name} ({official.role_title}) odbiega od {('aktualnej wypowiedzi premiera' if baseline_label == 'CURRENT_PRIME_MINISTER_STATEMENTS' else 'zobowiązania programowego exposé')} w sprawie {topic}. {reason}."
            ),
            statements_involved=[
                {
                    "statement_id": str(statement.id),
                    "official": official.full_name,
                    "quote": statement.content[:500],
                    "source": statement.source_type.value,
                },
                {
                    "statement_id": str(baseline_statement.id) if baseline_statement else None,
                    "official": "Prezes Rady Ministrów" if baseline_label == "CURRENT_PRIME_MINISTER_STATEMENTS" else "Exposé rządu",
                    "quote": baseline_statement.content[:500] if baseline_statement else "",
                    "source": baseline_statement.source_type.value if baseline_statement else "EXPOSE",
                },
            ],
            ministries_involved=[statement.ministry_id],
            officials_involved=[statement.official_id],
            resolution_status=ResolutionStatus.DETECTED,
            gemini_analysis={
                "topic": topic,
                "reason": reason,
                "baseline": baseline_label,
                "reference_window_days": reference_window_days,
                "expose_is_fallback_only": True,
            },
        )

    # --- STAGE 1: Routine Message Filter ---
    def is_routine_announcement(self, text: str) -> Tuple[bool, Optional[str]]:
        """Filters out non-substantive bureaucratic, ceremonial, and routine announcements."""
        lowered = text.lower()
        for pattern in ROUTINE_PATTERNS:
            if re.search(pattern, lowered):
                return True, f"Wykryto rutynowy komunikat administracyjny: '{pattern}'"
        return False, None

    # --- STAGE 2: Deep Logical & Policy Conflict Analysis ---
    def evaluate_legislative_initiative(
        self,
        initiative: LegislativeInitiative,
        sponsor_official: Optional[Official] = None,
    ) -> Optional[NarrativeConflict]:
        """Detects trial balloons ('BALON_PRÓBNY') where ministers announce laws without SKRM consensus."""
        if initiative.stage in (LegislativeStage.ZAPOWIEDZ_MEDIALNA, LegislativeStage.WYKAZ_PRAC_RM):
            if not initiative.has_skrm_approval:
                # Early public announcement of a bill without SKRM committee green light
                title = f"Balon próbny: {initiative.title} bez akceptacji SKRM"
                summary = (
                    f"Inicjatywa legislacyjna '{initiative.title}' została upubliczniona lub wpisana "
                    f"do wykazu bez formalnej akceptacji Stałego Komitetu Rady Ministrów (SKRM)."
                )
                ministries = [initiative.sponsor_ministry_id] if initiative.sponsor_ministry_id else []
                officials = [initiative.lead_official_id] if initiative.lead_official_id else []

                return NarrativeConflict(
                    conflict_type=ConflictType.BALON_PROBNY,
                    severity=Severity.P2_HIGH,
                    title=title,
                    summary=summary,
                    statements_involved=[
                        {
                            "initiative_title": initiative.title,
                            "stage": initiative.stage.value,
                            "has_skrm_approval": False,
                            "summary": initiative.summary,
                        }
                    ],
                    ministries_involved=ministries,
                    officials_involved=officials,
                    legislative_initiative_id=initiative.id,
                    resolution_status=ResolutionStatus.DETECTED,
                    gemini_analysis={
                        "risk_factor": "Brak uzgodnienia międzyresortowego na etapie SKRM",
                        "cohesion_impact": "Ryzyko publicznej kontry ze strony Ministerstwa Finansów lub KPRM",
                    },
                )
        return None

    def evaluate_inter_ministerial_cohesion(
        self,
        stmt_a: OfficialStatement,
        official_a: Official,
        stmt_b: OfficialStatement,
        official_b: Official,
    ) -> Optional[NarrativeConflict]:
        """Detects contradictions between two ministries or coalition partners on the same topic."""
        # Must involve two different officials or ministries
        if stmt_a.official_id == stmt_b.official_id:
            return None

        # Check time proximity (e.g. within 72 hours)
        delta = abs(stmt_a.published_at - stmt_b.published_at)
        if delta > timedelta(hours=72):
            return None

        combined_text = f"{stmt_a.content} {stmt_b.content}".lower()

        # Topic collision detection
        matched_topics = [t for t in POLICY_TOPICS if t in combined_text]
        if not matched_topics:
            return None

        topic = matched_topics[0]

        reason = self._contradiction_reason(stmt_a.content, stmt_b.content)
        has_direct_clash = reason is not None

        # Check if coalition parties differ
        is_coalition_friction = official_a.coalition_party != official_b.coalition_party

        if has_direct_clash:
            conflict_type = (
                ConflictType.NAPIECIE_KOALICYJNE if is_coalition_friction else ConflictType.KAKOFONIA_RESORTOWA
            )
            severity = Severity.P1_CRITICAL if is_coalition_friction else Severity.P2_HIGH

            title = f"{conflict_type.value}: Spór w temacie '{topic}' ({official_a.role_title} vs {official_b.role_title})"
            summary = (
                f"Wykryto sprzeczność stanowisk między {official_a.full_name} ({official_a.coalition_party.value}) "
                f"a {official_b.full_name} ({official_b.coalition_party.value}) w sprawie: {topic}. {reason}."
            )

            return NarrativeConflict(
                conflict_type=conflict_type,
                severity=severity,
                title=title,
                summary=summary,
                statements_involved=[
                    {
                        "statement_id": str(stmt_a.id),
                        "official": official_a.full_name,
                        "party": official_a.coalition_party.value,
                        "quote": stmt_a.content[:300],
                        "source": stmt_a.source_type.value,
                    },
                    {
                        "statement_id": str(stmt_b.id),
                        "official": official_b.full_name,
                        "party": official_b.coalition_party.value,
                        "quote": stmt_b.content[:300],
                        "source": stmt_b.source_type.value,
                    },
                ],
                ministries_involved=[stmt_a.ministry_id, stmt_b.ministry_id],
                officials_involved=[stmt_a.official_id, stmt_b.official_id],
                resolution_status=ResolutionStatus.DETECTED,
                gemini_analysis={
                    "topic": topic,
                    "reason": reason,
                    "coalition_parties": [official_a.coalition_party.value, official_b.coalition_party.value],
                    "recommended_action": "Pilne ujednolicenie przekazu na poziomie rzecznika rządu lub KPRM",
                },
            )

        return None

    def evaluate_eu_alignment(
        self,
        statement: OfficialStatement,
        official: Official,
        eu_binding_positions: Optional[List[Dict[str, str]]] = None,
    ) -> Optional[NarrativeConflict]:
        """Detects contradictions with Brussels negotiations or risk of EU infringement proceedings."""
        binding = eu_binding_positions or [
            {
                "topic": "pakt migracyjny",
                "risk": "ROZDŹWIĘK_Z_BRUKSELĄ",
                "infringement_risk": False,
                "keywords": ["pakt migracyjny", "bruksela", "unijne wytyczne"],
            },
            {
                "topic": "ets2",
                "risk": "RYZYKO_PROCEDURY_NARUSZENIOWEJ",
                "infringement_risk": True,
                "keywords": ["ets2", "odrzucenie dyrektywy", "nie wdrożymy"],
            },
            {
                "topic": "praworządność",
                "risk": "ROZDŹWIĘK_Z_BRUKSELĄ",
                "infringement_risk": True,
                "keywords": ["kamienie milowe", "tsue", "decyzja komisji"],
            },
        ]

        lowered = statement.content.lower()
        for rule in binding:
            matched_keywords = [kw for kw in rule["keywords"] if kw in lowered]
            if len(matched_keywords) >= 2:
                # Risk trigger
                conflict_type = (
                    ConflictType.RYZYKO_PROCEDURY_NARUSZENIOWEJ
                    if rule["infringement_risk"]
                    else ConflictType.ROZDZWIEK_Z_BRUKSELA
                )
                title = f"{conflict_type.value}: Wypowiedź dot. {rule['topic']} kolidująca ze stanowiskiem UE"
                summary = (
                    f"Wypowiedź {official.full_name} ({official.role_title}) w sprawie '{rule['topic']}' "
                    f"może zostać odczytana w Brukseli jako naruszenie zobowiązań lub kolizja ze stanowiskiem negocjacyjnym RP."
                )

                return NarrativeConflict(
                    conflict_type=conflict_type,
                    severity=Severity.P1_CRITICAL if rule["infringement_risk"] else Severity.P2_HIGH,
                    title=title,
                    summary=summary,
                    statements_involved=[
                        {
                            "statement_id": str(statement.id),
                            "official": official.full_name,
                            "quote": statement.content[:300],
                            "published_at": statement.published_at.isoformat(),
                        }
                    ],
                    ministries_involved=[statement.ministry_id],
                    officials_involved=[statement.official_id],
                    resolution_status=ResolutionStatus.DETECTED,
                    gemini_analysis={
                        "target_pion": "Minister ds. Unii Europejskiej",
                        "eu_rule_topic": rule["topic"],
                        "infringement_potential": rule["infringement_risk"],
                    },
                )
        return None

    def evaluate_interview_risks(
        self,
        statement: OfficialStatement,
        official: Official,
    ) -> Optional[NarrativeConflict]:
        """Detects slips during morning/evening interviews or aggression towards social groups."""
        if statement.source_type != SourceType.MEDIA_INTERVIEW:
            return None

        content_lower = statement.content.lower()

        # Aggression towards social groups
        social_targets = [
            ("przedsiębiorcy", ["przedsiębiorcy kombinują", "cwaniacy", "niech zamykają"]),
            ("nauczyciele", ["leniwi nauczyciele", "za dużo wolnego"]),
            ("rolnicy", ["roszczeniowi rolnicy", "tylko narzekają"]),
            ("pacjenci", ["wymysły pacjentów"]),
        ]

        for group, markers in social_targets:
            for marker in markers:
                if marker in content_lower:
                    title = f"Agresja wobec grupy społecznej: {group.capitalize()} ({official.full_name})"
                    summary = (
                        f"W porannym/wieczornym wywiadzie medialnym {official.full_name} użył sformułowań uderzających w "
                        f"grupę: {group}. Istnieje natychmiastowe ryzyko kryzysu medialnego i protestów branżowych."
                    )
                    return NarrativeConflict(
                        conflict_type=ConflictType.AGRESJA_WOBEC_GRUP_SPOLECZNYCH,
                        severity=Severity.P1_CRITICAL,
                        title=title,
                        summary=summary,
                        statements_involved=[
                            {
                                "statement_id": str(statement.id),
                                "official": official.full_name,
                                "quote": statement.content,
                            }
                        ],
                        ministries_involved=[statement.ministry_id],
                        officials_involved=[statement.official_id],
                        resolution_status=ResolutionStatus.DETECTED,
                        gemini_analysis={
                            "targeted_group": group,
                            "media_rebound_risk": "BARDZO_WYSOKIE",
                        },
                    )

        # Unforced error in interview (BŁĄD_W_WYWIADZIE)
        slip_markers = [
            "nie wiem co mówił premier",
            "to nie moja sprawa",
            "rząd nie panuje nad",
            "nie konsultowałem tego z premierem",
        ]
        for marker in slip_markers:
            if marker in content_lower:
                title = f"Błąd w wywiadzie medialnym: {official.full_name}"
                summary = (
                    f"{official.full_name} w wywiadzie medialnym sformułował niefortunne oświadczenie: '{marker}', "
                    f"stwarzające natychmiastowe paliwo krytyczne dla opozycji i mediów."
                )
                return NarrativeConflict(
                    conflict_type=ConflictType.BLAD_W_WYWIADZIE,
                    severity=Severity.P2_HIGH,
                    title=title,
                    summary=summary,
                    statements_involved=[
                        {
                            "statement_id": str(statement.id),
                            "official": official.full_name,
                            "quote": statement.content,
                        }
                    ],
                    ministries_involved=[statement.ministry_id],
                    officials_involved=[statement.official_id],
                    resolution_status=ResolutionStatus.DETECTED,
                    gemini_analysis={
                        "blunder_type": "Niespójność komunikacji wewnętrznej rządu",
                        "immediate_action": "Oświadczenie prostujące rzecznika resortu lub KPRM",
                    },
                )

        return None

    def evaluate_government_attack(
        self,
        article_title: str,
        article_content: str,
        source_name: str,
        source_url: Optional[str] = None,
        published_at: Optional[datetime] = None,
    ) -> Optional[NarrativeConflict]:
        """Flags an external attack on the government as a pressure signal.

        This does not establish that an allegation is true. It identifies a
        relevant, potentially escalating attack that requires official fact
        verification and a communication response.
        """
        text = f"{article_title} {article_content}".lower()
        government_markers = ("rząd", "premier", "minister", "ministerstwo", "kprm", "koalicj")
        attack_markers = (
            "afera", "kłamstwo", "kłamie", "skandal", "dymisj", "dane są fałszywe",
            "prokuratura", "zarzuty", "ukrywa", "oszukał", "oszustwo", "atak opozycji",
        )
        matched_government = [marker for marker in government_markers if marker in text]
        matched_attack = [marker for marker in attack_markers if marker in text]
        if not matched_government or len(matched_attack) < 2:
            return None

        topic = self._matching_topics(text)
        topic_label = topic[0] if topic else "działania rządu"
        return NarrativeConflict(
            conflict_type=ConflictType.ATAK_NA_RZAD,
            severity=Severity.P1_CRITICAL if any(marker in text for marker in ("dymisj", "prokuratura", "kłamstwo")) else Severity.P2_HIGH,
            title=f"Atak na rząd: {topic_label}",
            summary=(
                f"Materiał {source_name} zawiera skumulowane zarzuty wobec rządu lub jego przedstawicieli w sprawie {topic_label}. "
                "To sygnał presji komunikacyjnej; prawdziwość zarzutów wymaga osobnej weryfikacji źródłowej."
            ),
            statements_involved=[
                {
                    "official": "Źródło medialne",
                    "quote": article_content[:500],
                    "source": source_name,
                    "source_url": source_url,
                    "published_at": (published_at or datetime.now(timezone.utc)).isoformat(),
                }
            ],
            resolution_status=ResolutionStatus.DETECTED,
            gemini_analysis={
                "signal_type": "EXTERNAL_ATTACK",
                "attack_markers": matched_attack,
                "requires_official_fact_check": True,
                "allegation_is_not_established_fact": True,
            },
        )

    def evaluate_statement_integrity(
        self,
        statement: OfficialStatement,
        official: Official,
        factual_evidence: Optional[List[Dict[str, str]]] = None,
    ) -> Optional[NarrativeConflict]:
        """Flags risky claims and labels factual contradictions only with evidence."""
        lowered = statement.content.lower()
        risk_markers = (
            "gwarantuję", "na pewno", "bez żadnych kosztów", "wszyscy dostaną",
            "nie ma żadnego problemu", "dane są jednoznaczne", "potwierdzono",
        )
        matched_markers = [marker for marker in risk_markers if marker in lowered]
        evidence = factual_evidence or []
        evidence_contradicts = any(
            item.get("supports_claim", "").lower() == "false" and item.get("source_url")
            for item in evidence
        )
        if not matched_markers and not evidence_contradicts:
            return None

        severity = Severity.P1_CRITICAL if evidence_contradicts else Severity.P2_HIGH
        basis = "zweryfikowane źródło przeczy twierdzeniu" if evidence_contradicts else "kategoryczne twierdzenie wymaga weryfikacji"
        return NarrativeConflict(
            conflict_type=ConflictType.RYZYKO_FAKTUALNE,
            severity=severity,
            title=f"Ryzyko faktualne: {official.full_name}",
            summary=(
                f"Wypowiedź {official.full_name} zawiera twierdzenie o podwyższonym ryzyku faktualnym: {basis}. "
                "System nie oznacza wypowiedzi jako fałszywej bez wskazanego źródła weryfikacyjnego."
            ),
            statements_involved=[
                {
                    "statement_id": str(statement.id),
                    "official": official.full_name,
                    "quote": statement.content[:500],
                    "source": statement.source_type.value,
                },
                *[
                    {"source": item.get("source_name", "Źródło weryfikacyjne"), "source_url": item.get("source_url", ""), "supports_claim": item.get("supports_claim", "")}
                    for item in evidence
                ],
            ],
            ministries_involved=[statement.ministry_id],
            officials_involved=[statement.official_id],
            resolution_status=ResolutionStatus.DETECTED,
            gemini_analysis={
                "risk_markers": matched_markers,
                "factual_evidence": evidence,
                "claim_status": "CONTRADICTED_WITH_EVIDENCE" if evidence_contradicts else "REQUIRES_VERIFICATION",
            },
        )

    def generate_alert_for_conflict(self, conflict: NarrativeConflict) -> Alert:
        """Constructs an instant alert with audience routing based on conflict typology."""
        priority = (
            "P1"
            if conflict.severity == Severity.P1_CRITICAL
            else ("P2" if conflict.severity == Severity.P2_HIGH else "P3")
        )

        if conflict.conflict_type in (
            ConflictType.ROZDZWIEK_Z_BRUKSELA,
            ConflictType.RYZYKO_PROCEDURY_NARUSZENIOWEJ,
        ):
            target = TargetAudience.MINISTER_UE
        elif conflict.conflict_type in (
            ConflictType.NAPIECIE_KOALICYJNE,
            ConflictType.SPRZECZNOSC_Z_EXPOSE,
            ConflictType.ATAK_NA_RZAD,
            ConflictType.RYZYKO_FAKTUALNE,
        ):
            target = TargetAudience.KPRM_PREMIER
        else:
            target = TargetAudience.KPRM_KOMUNIKACJA

        return Alert(
            conflict_id=conflict.id,
            priority=priority,
            target_audience=target,
            channel="INTERNAL_RADAR",
            status="QUEUED",
            payload={
                "conflict_title": conflict.title,
                "conflict_type": conflict.conflict_type.value,
                "severity": conflict.severity.value,
                "summary": conflict.summary,
                "generated_at": datetime.now(timezone.utc).isoformat(),
            },
        )
