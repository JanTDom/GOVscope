"""Domain models and enumerations for the GOVscope intelligence platform."""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field


class CoalitionParty(str, Enum):
    KO = "KO"
    PSL = "PSL"
    POLSKA_2050 = "POLSKA_2050"
    NOWA_LEWICA = "NOWA_LEWICA"
    NON_PARTISAN = "NON_PARTISAN"


class RoleCategory(str, Enum):
    PREMIER = "PREMIER"
    WICEPREMIER = "WICEPREMIER"
    MINISTER = "MINISTER"
    WICEMINISTER = "WICEMINISTER"
    PELNOMOCNIK = "PELNOMOCNIK"
    RZECZNIK = "RZECZNIK"
    DYREKTOR_GENERALNY = "DYREKTOR_GENERALNY"


class SourceType(str, Enum):
    GOV_PL = "GOV_PL"
    X_TWITTER = "X_TWITTER"
    LINKEDIN = "LINKEDIN"
    PRESS_CONFERENCE = "PRESS_CONFERENCE"
    MEDIA_INTERVIEW = "MEDIA_INTERVIEW"
    SEJM_SPEECH = "SEJM_SPEECH"


class LegislativeStage(str, Enum):
    PREKONSULTACJE = "PREKONSULTACJE"
    ZAPOWIEDZ_MEDIALNA = "ZAPOWIEDŹ_MEDIALNA"
    WYKAZ_PRAC_RM = "WYKAZ_PRAC_RM"
    KONSULTACJE_PUBLICZNE = "KONSULTACJE_PUBLICZNE"
    SKRM = "SKRM"
    RADA_MINISTROW = "RADA_MINISTROW"
    SEJM = "SEJM"


class ConflictType(str, Enum):
    KAKOFONIA_RESORTOWA = "KAKOFONIA_RESORTOWA"
    BALON_PROBNY = "BALON_PRÓBNY"
    SPRZECZNOSC_Z_EXPOSE = "SPRZECZNOŚĆ_Z_EXPOSE"
    NAPIECIE_KOALICYJNE = "NAPIĘCIE_KOALICYJNE"
    ROZDZWIEK_Z_BRUKSELA = "ROZDŹWIĘK_Z_BRUKSELĄ"
    RYZYKO_PROCEDURY_NARUSZENIOWEJ = "RYZYKO_PROCEDURY_NARUSZENIOWEJ"
    BLAD_W_WYWIADZIE = "BŁĄD_W_WYWIADZIE"
    AGRESJA_WOBEC_GRUP_SPOLECZNYCH = "AGRESJA_WOBEC_GRUP_SPOŁECZNYCH"
    ATAK_NA_RZAD = "ATAK_NA_RZĄD"
    RYZYKO_FAKTUALNE = "RYZYKO_FAKTUALNE"


class Severity(str, Enum):
    P1_CRITICAL = "P1_CRITICAL"
    P2_HIGH = "P2_HIGH"
    P3_MODERATE = "P3_MODERATE"


class ResolutionStatus(str, Enum):
    DETECTED = "DETECTED"
    REVIEWED = "REVIEWED"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"


class TargetAudience(str, Enum):
    KPRM_PREMIER = "KPRM_PREMIER"
    KPRM_KOMUNIKACJA = "KPRM_KOMUNIKACJA"
    MINISTER_UE = "MINISTER_UE"
    RESORT_LEAD = "RESORT_LEAD"


class Ministry(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    code: str
    name_pl: str
    short_name: str
    body_type: str = "MINISTRY"
    coalition_party: Optional[CoalitionParty] = None
    website_url: Optional[str] = None
    bip_url: Optional[str] = None
    rss_feeds: List[str] = Field(default_factory=list)
    social_handles: Dict[str, str] = Field(default_factory=dict)
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Official(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    ministry_id: Optional[UUID] = None
    full_name: str
    role_title: str
    role_category: RoleCategory
    coalition_party: CoalitionParty
    x_handle: Optional[str] = None
    linkedin_url: Optional[str] = None
    responsibilities: List[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OfficialStatement(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    official_id: UUID
    ministry_id: UUID
    source_type: SourceType
    title: str
    content: str
    summary: Optional[str] = None
    topic_category: Optional[str] = None
    published_at: datetime
    source_url: Optional[str] = None
    raw_metadata: Dict[str, Any] = Field(default_factory=dict)
    is_routine_filtered: bool = False
    filter_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class LegislativeInitiative(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    rcl_number: Optional[str] = None
    title: str
    sponsor_ministry_id: Optional[UUID] = None
    lead_official_id: Optional[UUID] = None
    stage: LegislativeStage
    has_skrm_approval: bool = False
    summary: Optional[str] = None
    key_assumptions: List[str] = Field(default_factory=list)
    source_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class NarrativeConflict(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    conflict_type: ConflictType
    severity: Severity
    title: str
    summary: str
    statements_involved: List[Dict[str, Any]] = Field(default_factory=list)
    ministries_involved: List[UUID] = Field(default_factory=list)
    officials_involved: List[UUID] = Field(default_factory=list)
    legislative_initiative_id: Optional[UUID] = None
    resolution_status: ResolutionStatus = ResolutionStatus.DETECTED
    gemini_analysis: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Alert(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: UUID = Field(default_factory=uuid4)
    conflict_id: UUID
    priority: str  # P1, P2, P3
    target_audience: TargetAudience
    channel: str = "INTERNAL_RADAR"
    status: str = "QUEUED"
    payload: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
