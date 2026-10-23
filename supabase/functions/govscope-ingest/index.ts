import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

type Source = { key: string; name: string; url: string; media: boolean; pagePrefix?: string };
type RecordItem = {
  source_key: string;
  source_name: string;
  title: string;
  content: string;
  source_url: string;
  published_at: string;
  content_hash: string;
};

const sources: Source[] = [
  { key: "govpl_premier", name: "Gov.pl KPRM", url: "https://www.gov.pl/web/premier", media: false, pagePrefix: "/web/premier/" },
  { key: "govpl_finanse", name: "Gov.pl Ministerstwo Finansów", url: "https://www.gov.pl/web/finanse", media: false, pagePrefix: "/web/finanse/" },
  { key: "govpl_msz", name: "Gov.pl Ministerstwo Spraw Zagranicznych", url: "https://www.gov.pl/web/dyplomacja", media: false, pagePrefix: "/web/dyplomacja/" },
  { key: "govpl_mon", name: "Gov.pl Ministerstwo Obrony Narodowej", url: "https://www.gov.pl/web/obrona-narodowa", media: false, pagePrefix: "/web/obrona-narodowa/" },
  { key: "govpl_mswia", name: "Gov.pl Ministerstwo Spraw Wewnętrznych i Administracji", url: "https://www.gov.pl/web/mswia", media: false, pagePrefix: "/web/mswia/" },
  { key: "govpl_ms", name: "Gov.pl Ministerstwo Sprawiedliwości", url: "https://www.gov.pl/web/sprawiedliwosc", media: false, pagePrefix: "/web/sprawiedliwosc/" },
  { key: "govpl_map", name: "Gov.pl Ministerstwo Aktywów Państwowych", url: "https://www.gov.pl/web/aktywa-panstwowe", media: false, pagePrefix: "/web/aktywa-panstwowe/" },
  { key: "govpl_mrit", name: "Gov.pl Ministerstwo Rozwoju i Technologii", url: "https://www.gov.pl/web/rozwoj-technologia", media: false, pagePrefix: "/web/rozwoj-technologia/" },
  { key: "govpl_mkis", name: "Gov.pl Ministerstwo Klimatu i Środowiska", url: "https://www.gov.pl/web/klimat", media: false, pagePrefix: "/web/klimat/" },
  { key: "govpl_mrpips", name: "Gov.pl Ministerstwo Rodziny, Pracy i Polityki Społecznej", url: "https://www.gov.pl/web/rodzina", media: false, pagePrefix: "/web/rodzina/" },
  { key: "govpl_mz", name: "Gov.pl Ministerstwo Zdrowia", url: "https://www.gov.pl/web/zdrowie", media: false, pagePrefix: "/web/zdrowie/" },
  { key: "govpl_men", name: "Gov.pl Ministerstwo Edukacji Narodowej", url: "https://www.gov.pl/web/edukacja", media: false, pagePrefix: "/web/edukacja/" },
  { key: "govpl_mnisw", name: "Gov.pl Ministerstwo Nauki i Szkolnictwa Wyższego", url: "https://www.gov.pl/web/nauka", media: false, pagePrefix: "/web/nauka/" },
  { key: "govpl_mi", name: "Gov.pl Ministerstwo Infrastruktury", url: "https://www.gov.pl/web/infrastruktura", media: false, pagePrefix: "/web/infrastruktura/" },
  { key: "govpl_mrirw", name: "Gov.pl Ministerstwo Rolnictwa i Rozwoju Wsi", url: "https://www.gov.pl/web/rolnictwo", media: false, pagePrefix: "/web/rolnictwo/" },
  { key: "govpl_mc", name: "Gov.pl Ministerstwo Cyfryzacji", url: "https://www.gov.pl/web/cyfryzacja", media: false, pagePrefix: "/web/cyfryzacja/" },
  { key: "govpl_mkidn", name: "Gov.pl Ministerstwo Kultury i Dziedzictwa Narodowego", url: "https://www.gov.pl/web/kultura", media: false, pagePrefix: "/web/kultura/" },
  { key: "govpl_msit", name: "Gov.pl Ministerstwo Sportu i Turystyki", url: "https://www.gov.pl/web/sport", media: false, pagePrefix: "/web/sport/" },
  { key: "govpl_mp", name: "Gov.pl Ministerstwo Przemysłu", url: "https://www.gov.pl/web/przemysl", media: false, pagePrefix: "/web/przemysl/" },
  { key: "rmf24", name: "RMF24", url: "https://www.rmf24.pl/fakty/polska/feed", media: true },
  { key: "polsat_news", name: "Polsat News", url: "https://www.polsatnews.pl/rss/wszystkie.xml", media: true },
  { key: "rzeczpospolita", name: "Rzeczpospolita", url: "https://www.rp.pl/rss_main", media: true },
  { key: "tvn24", name: "TVN24", url: "https://tvn24.pl/wiadomosci-z-kraju,3.xml", media: true },
  { key: "pap_mediaroom", name: "PAP MediaRoom", url: "https://pap-mediaroom.pl/rss", media: true },
];

const governmentSignals = [
  "rząd", "premier", "minister", "ministerstwo", "kprm", "sejm", "senat", "rcl",
  "ustaw", "rozporząd", "budżet", "podatek", "składk", "kpo", "fundusz", "koalicj",
  "ue", "unia europejska", "bruksela", "donald tusk", "pełczyńska", "szyszko",
  "domanski", "domański", "kosiniak", "hołownia", "kierwiński", "sikorski",
];

function isGovernmentRelevant(item: RecordItem, source: Source): boolean {
  if (!source.media) return true;
  const haystack = `${item.title} ${item.content}`.toLocaleLowerCase("pl-PL");
  return governmentSignals.some((signal) => haystack.includes(signal));
}

const text = (value: string) => value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
const tag = (xml: string, name: string) => {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return match ? text(match[1]) : "";
};
const hash = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

function parseFeed(xml: string, source: Source): Promise<RecordItem[]> {
  const itemMatches = [...xml.matchAll(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/gi)];
  return Promise.all(itemMatches.map(async (match) => {
    const item = match[0];
    const title = tag(item, "title") || "Komunikat urzędowy";
    const link = tag(item, "link") || (item.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] ?? "");
    const published = tag(item, "pubDate") || tag(item, "published") || tag(item, "updated");
    const content = tag(item, "description") || tag(item, "summary") || tag(item, "content") || title;
    return {
      source_key: source.key,
      source_name: source.name,
      title,
      content,
      source_url: link,
      published_at: published,
      content_hash: await hash(`${source.key}\u001f${link || title}\u001f${title}`),
    };
  }));
}

async function fetchItems(source: Source): Promise<RecordItem[]> {
  const response = await fetch(source.url, { headers: { "user-agent": "GOVscope/1.0 (+https://govscope.pl)" } });
  if (!response.ok) throw new Error(`${source.url}: HTTP ${response.status}`);
  const body = await response.text();
  if (source.media) return parseFeed(body, source);
  const section = body.split(/id=["']Aktualnosci["']/i)[1]?.split(/<\/section>/i)[0] ?? "";
  const officialLinks = [...section.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ url: new URL(match[1], source.url).toString(), title: text(match[2]) }))
    .filter((item) => item.url.includes(source.pagePrefix ?? "/web/premier/") && item.title && !item.url.endsWith("/wydarzenia"));
  if (officialLinks.length) {
    return Promise.all(officialLinks.slice(0, 20).map(async (item) => ({
      source_key: source.key,
      source_name: source.name,
      title: item.title,
      content: item.title,
      source_url: item.url,
      published_at: "",
      content_hash: await hash(`${source.key}\u001f${item.url}\u001f${item.title}`),
    })));
  }
  const feedUrls = [...body.matchAll(/<link[^>]+(?:href|url)=["']([^"']*(?:rss|feed|atom|xml)[^"']*)["']/gi)].map((match) => new URL(match[1], source.url).toString());
  const records: RecordItem[] = [];
  for (const feedUrl of [...new Set(feedUrls)].slice(0, 6)) {
    const feedResponse = await fetch(feedUrl, { headers: { "user-agent": "GOVscope/1.0 (+https://govscope.pl)" } });
    if (feedResponse.ok) records.push(...await parseFeed(await feedResponse.text(), source));
  }
  return records;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "POST required" }), { status: 405 });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const result = { records_seen: 0, records_written: 0, sources_succeeded: 0, sources_failed: 0 };
  for (const source of sources) {
    const started = new Date().toISOString();
    try {
      const records = (await fetchItems(source)).filter((item) => item.source_url && isGovernmentRelevant(item, source));
      result.records_seen += records.length;
      const sourceRegistration = await supabase.from("ingestion_sources").upsert({
        source_key: source.key,
        source_name: source.name,
        source_kind: source.media ? "RSS" : "GOV_PL_HTML",
        endpoint_url: source.url,
        enabled: true,
        updated_at: started,
      }, { onConflict: "source_key" });
      if (sourceRegistration.error) throw sourceRegistration.error;
      const run = await supabase.from("ingestion_runs").insert({ source_key: source.key, status: "RUNNING", records_seen: records.length }).select("id").single();
      if (run.error) throw run.error;
      const table = source.media ? "media_coverage" : "official_statements";
      const rows = source.media
        ? records.map((item) => ({ outlet_name: item.source_name, article_title: item.title, content: item.content, published_at: item.published_at || started, source_url: item.source_url, source_key: item.source_key, content_hash: item.content_hash, verified: true, fetched_at: started }))
        : records.map((item) => ({ source_type: "GOV_PL", title: item.title, content: item.content, published_at: item.published_at || started, source_url: item.source_url, raw_metadata: { source_name: item.source_name }, source_key: item.source_key, content_hash: item.content_hash, verified: true, fetched_at: started }));
      let count = 0;
      for (const row of rows) {
        const inserted = await supabase.from(table).insert(row);
        if (inserted.error && inserted.error.code !== "23505") throw inserted.error;
        if (!inserted.error) count += 1;
      }
      result.records_written += count;
      await supabase.from("ingestion_runs").update({ status: "SUCCEEDED", records_written: count, finished_at: new Date().toISOString() }).eq("id", run.data.id);
      await supabase.from("ingestion_sources").update({ last_success_at: new Date().toISOString(), last_error: null, records_ingested: count, updated_at: new Date().toISOString() }).eq("source_key", source.key);
      result.sources_succeeded += 1;
    } catch (error) {
      result.sources_failed += 1;
      await supabase.from("ingestion_sources").update({ last_error_at: new Date().toISOString(), last_error: JSON.stringify(error).slice(0, 1000), updated_at: new Date().toISOString() }).eq("source_key", source.key);
    }
  }
  return new Response(JSON.stringify(result), { headers: { "content-type": "application/json" } });
});
