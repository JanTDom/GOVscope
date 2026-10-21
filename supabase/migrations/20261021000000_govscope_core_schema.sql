-- GOVscope Core Relational & Vector Schema
-- Migration: 20261021000000_govscope_core_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Ministries, Committees and State Bodies
CREATE TABLE IF NOT EXISTS ministries_and_bodies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE, -- e.g. KPRM, MSZ, MF, MAP, MS, MEN, MRiT, MI, MZ, MKiŚ, etc.
    name_pl TEXT NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    body_type VARCHAR(30) NOT NULL DEFAULT 'MINISTRY', -- MINISTRY, COMMITTEE, CENTRAL_OFFICE
    coalition_party VARCHAR(50), -- KO, PSL, POLSKA_2050, NOWA_LEWICA, NON_PARTISAN
    website_url TEXT,
    bip_url TEXT,
    rss_feeds TEXT[] DEFAULT '{}',
    social_handles JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Government Officials (Rada Ministrów, wiceministrowie, pełnomocnicy, rzecznicy)
CREATE TABLE IF NOT EXISTS officials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ministry_id UUID REFERENCES ministries_and_bodies(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    role_category VARCHAR(30) NOT NULL, -- PREMIER, WICEPREMIER, MINISTER, WICEMINISTER, PELNOMOCNIK, RZECZNIK
    coalition_party VARCHAR(50) NOT NULL, -- KO, PSL, POLSKA_2050, NOWA_LEWICA, NON_PARTISAN
    x_handle VARCHAR(100),
    linkedin_url TEXT,
    responsibilities TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Official Statements (komunikaty, wystąpienia, wywiady, social media)
CREATE TABLE IF NOT EXISTS official_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    official_id UUID REFERENCES officials(id) ON DELETE CASCADE,
    ministry_id UUID REFERENCES ministries_and_bodies(id) ON DELETE CASCADE,
    source_type VARCHAR(30) NOT NULL, -- GOV_PL, X_TWITTER, LINKEDIN, PRESS_CONFERENCE, MEDIA_INTERVIEW, SEJM_SPEECH
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    topic_category VARCHAR(100),
    published_at TIMESTAMPTZ NOT NULL,
    source_url TEXT,
    raw_metadata JSONB DEFAULT '{}'::jsonb,
    is_routine_filtered BOOLEAN NOT NULL DEFAULT FALSE,
    filter_reason TEXT,
    embedding VECTOR(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Legislative Initiatives (RCL, Wykaz prac RM, Druki Sejmowe)
CREATE TABLE IF NOT EXISTS legislative_initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rcl_number VARCHAR(50) UNIQUE,
    title TEXT NOT NULL,
    sponsor_ministry_id UUID REFERENCES ministries_and_bodies(id) ON DELETE SET NULL,
    lead_official_id UUID REFERENCES officials(id) ON DELETE SET NULL,
    stage VARCHAR(50) NOT NULL, -- PREKONSULTACJE, WYKAZ_PRAC_RM, KONSULTACJE_PUBLICZNE, SKRM, RADA_MINISTROW, SEJM
    has_skrm_approval BOOLEAN NOT NULL DEFAULT FALSE,
    summary TEXT,
    key_assumptions TEXT[] DEFAULT '{}',
    source_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Narrative Conflicts & Cohesion Breaches
CREATE TABLE IF NOT EXISTS narrative_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conflict_type VARCHAR(50) NOT NULL, -- KAKOFONIA_RESORTOWA, BALON_PRÓBNY, SPRZECZNOŚĆ_Z_EXPOSE, NAPIĘCIE_KOALICYJNE, ROZDŹWIĘK_Z_BRUKSELĄ, RYZYKO_PROCEDURY_NARUSZENIOWEJ, BŁĄD_W_WYWIADZIE, AGRESJA_WOBEC_GRUP_SPOŁECZNYCH
    severity VARCHAR(20) NOT NULL, -- P1_CRITICAL, P2_HIGH, P3_MODERATE
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    statements_involved JSONB NOT NULL DEFAULT '[]'::jsonb,
    ministries_involved UUID[] DEFAULT '{}',
    officials_involved UUID[] DEFAULT '{}',
    legislative_initiative_id UUID REFERENCES legislative_initiatives(id) ON DELETE SET NULL,
    resolution_status VARCHAR(30) NOT NULL DEFAULT 'DETECTED', -- DETECTED, REVIEWED, ACKNOWLEDGED, RESOLVED
    gemini_analysis JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Media Coverage & Depesze Agencyjne (PAP, media ogólnokrajowe)
CREATE TABLE IF NOT EXISTS media_coverage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_name VARCHAR(100) NOT NULL,
    article_title TEXT NOT NULL,
    content TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    source_url TEXT,
    minhash_signature TEXT,
    cited_statement_ids UUID[] DEFAULT '{}',
    conflict_ids UUID[] DEFAULT '{}',
    sentiment VARCHAR(20), -- NEUTRAL, CRITICAL, SUPPORTIVE
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Alerts for KPRM and Ministerial Leadership
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conflict_id UUID REFERENCES narrative_conflicts(id) ON DELETE CASCADE,
    priority VARCHAR(10) NOT NULL, -- P1, P2, P3
    target_audience VARCHAR(50) NOT NULL, -- KPRM_PREMIER, KPRM_KOMUNIKACJA, MINISTER_UE, RESORT_LEAD
    channel VARCHAR(30) NOT NULL DEFAULT 'INTERNAL_RADAR', -- INTERNAL_RADAR, SMS, EMAIL, SIGNAL
    status VARCHAR(20) NOT NULL DEFAULT 'QUEUED', -- QUEUED, DELIVERED, READ, DISMISSED
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Standard B-Tree indices for relational performance and lookups
CREATE INDEX IF NOT EXISTS idx_ministries_code ON ministries_and_bodies(code);
CREATE INDEX IF NOT EXISTS idx_officials_ministry ON officials(ministry_id);
CREATE INDEX IF NOT EXISTS idx_officials_role ON officials(role_category);
CREATE INDEX IF NOT EXISTS idx_officials_party ON officials(coalition_party);
CREATE INDEX IF NOT EXISTS idx_statements_official ON official_statements(official_id);
CREATE INDEX IF NOT EXISTS idx_statements_ministry ON official_statements(ministry_id);
CREATE INDEX IF NOT EXISTS idx_statements_published_at ON official_statements(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_conflicts_severity ON narrative_conflicts(severity);
CREATE INDEX IF NOT EXISTS idx_conflicts_type ON narrative_conflicts(conflict_type);
CREATE INDEX IF NOT EXISTS idx_conflicts_status ON narrative_conflicts(resolution_status);
CREATE INDEX IF NOT EXISTS idx_conflicts_created_at ON narrative_conflicts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_priority ON alerts(priority);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_media_published_at ON media_coverage(published_at DESC);

-- GIN trigram indices for full-text and partial Polish morphology searching
CREATE INDEX IF NOT EXISTS idx_statements_content_trgm ON official_statements USING gin (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_statements_title_trgm ON official_statements USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_officials_name_trgm ON officials USING gin (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_legislative_title_trgm ON legislative_initiatives USING gin (title gin_trgm_ops);

-- pgvector HNSW index for high-dimensional semantic search
CREATE INDEX IF NOT EXISTS idx_statements_embedding_hnsw ON official_statements USING hnsw (embedding vector_cosine_ops);

