import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";

type Source = { key: string; name: string; url: string; media: boolean };
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
  { key: "govpl_premier", name: "Gov.pl KPRM", url: "https://www.gov.pl/web/premier", media: false },
  { key: "rmf24", name: "RMF24", url: "https://www.rmf24.pl/fakty/polska/feed", media: true },
  { key: "polsat_news", name: "Polsat News", url: "https://www.polsatnews.pl/rss/wszystkie.xml", media: true },
  { key: "rzeczpospolita", name: "Rzeczpospolita", url: "https://www.rp.pl/rss_main", media: true },
  { key: "tvn24", name: "TVN24", url: "https://tvn24.pl/wiadomosci-z-kraju,3.xml", media: true },
  { key: "pap_mediaroom", name: "PAP MediaRoom", url: "https://pap-mediaroom.pl/rss", media: true },
];

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
  if (source.key !== "govpl_premier") return parseFeed(body, source);
  const section = body.split(/id=["']Aktualnosci["']/i)[1]?.split(/<\/section>/i)[0] ?? "";
  const officialLinks = [...section.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => ({ url: new URL(match[1], source.url).toString(), title: text(match[2]) }))
    .filter((item) => item.url.includes("/web/premier/") && item.title && !item.url.endsWith("/wydarzenia"));
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
      const records = (await fetchItems(source)).filter((item) => item.source_url);
      result.records_seen += records.length;
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
