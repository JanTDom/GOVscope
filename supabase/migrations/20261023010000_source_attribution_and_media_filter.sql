-- Attribute official gov.pl records to their publishing ministry and remove
-- known non-government media noise that predates the relevance filter.

UPDATE official_statements AS statement
SET ministry_id = ministry.id
FROM ministries_and_bodies AS ministry
WHERE statement.ministry_id IS NULL
  AND statement.source_key = CASE ministry.code
    WHEN 'KPRM' THEN 'govpl_premier'
    WHEN 'MF' THEN 'govpl_finanse'
    WHEN 'MSZ' THEN 'govpl_msz'
    WHEN 'MON' THEN 'govpl_mon'
    WHEN 'MSWiA' THEN 'govpl_mswia'
    WHEN 'MS' THEN 'govpl_ms'
    WHEN 'MAP' THEN 'govpl_map'
    WHEN 'MRiT' THEN 'govpl_mrit'
    WHEN 'MKiŚ' THEN 'govpl_mkis'
    WHEN 'MRPiPS' THEN 'govpl_mrpips'
    WHEN 'MZ' THEN 'govpl_mz'
    WHEN 'MEN' THEN 'govpl_men'
    WHEN 'MNiSW' THEN 'govpl_mnisw'
    WHEN 'MI' THEN 'govpl_mi'
    WHEN 'MRiRW' THEN 'govpl_mrirw'
    WHEN 'MC' THEN 'govpl_mc'
    WHEN 'MKiDN' THEN 'govpl_mkidn'
    WHEN 'MSiT' THEN 'govpl_msit'
    WHEN 'MP' THEN 'govpl_mp'
  END;

UPDATE official_statements AS statement
SET official_id = premier.id,
    raw_metadata = COALESCE(statement.raw_metadata, '{}'::jsonb)
      || jsonb_build_object('attributed_to_prime_minister', TRUE, 'source_scope', 'PRIME_MINISTER_PUBLIC_STATEMENT')
FROM officials AS premier
WHERE statement.official_id IS NULL
  AND statement.source_key = 'govpl_premier'
  AND premier.full_name = 'Donald Tusk'
  AND premier.is_active = TRUE
  AND statement.content ~* '(donald tusk|premier|prezes rady ministrów|konferencja premiera)';

UPDATE government_activities AS activity
SET ministry_id = ministry.id
FROM ministries_and_bodies AS ministry
WHERE activity.ministry_id IS NULL
  AND activity.source_key = 'govpl_premier_events'
  AND ministry.code = 'KPRM';

DELETE FROM media_coverage
WHERE article_title ~* '(trzęsienie ziemi|morze tyrreńskie|sycylia|wstrząsy sejsmiczne)';
