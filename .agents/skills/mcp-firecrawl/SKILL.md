---
name: mcp-firecrawl
description: >
  Use the Firecrawl MCP server to scrape, crawl, search, and extract structured data from
  websites. Use this skill when you need to: scrape a webpage for its content, crawl a site
  to collect multiple pages, search the web for specific information, extract structured data
  from one or more URLs using a schema, or map a website's URL structure. Use Firecrawl for
  Dhara tasks like scraping competitor booking platforms for research, extracting SSLCommerz
  or payment gateway documentation pages, pulling in real-world NGO facility data for seeding,
  or any task that requires clean LLM-ready content from a live website. Prefer Firecrawl over
  basic web_fetch when you need clean markdown, structured JSON extraction, or multi-page content.
---

# Firecrawl MCP Skill

Firecrawl turns any website into clean, LLM-ready data. It handles JavaScript rendering,
anti-bot protection, pagination, and boilerplate stripping automatically. Use it when you
need real web content — not just a search snippet.

## Tools

### `firecrawl_scrape` — Single page extraction
Scrape one URL and get clean content back.

```json
{
  "url": "https://example.com/page",
  "formats": ["markdown"],          // "markdown" | "html" | "json"
  "onlyMainContent": true,           // strips nav, footer, ads
  "maxAge": 172800000                // use cache (500% faster) - 2 days in ms
}
```

**Best for**: Single page content extraction when you know the exact URL.
**Returns**: Clean markdown or HTML, ready to read or pass to the model.

For structured extraction, use JSON format with a schema and prompt:
```json
{
  "url": "https://example.com/product",
  "formats": [{"type": "json", "prompt": "Extract price and description", "schema": {...}}]
}
```

### `firecrawl_batch_scrape` — Multiple URLs at once
Scrape a list of known URLs in parallel.

```json
{
  "urls": ["https://example.com/page1", "https://example.com/page2"],
  "formats": ["markdown"],
  "onlyMainContent": true
}
```

**Best for**: When you already know which pages you need.
**Do NOT use**: `firecrawl_scrape` in a loop — use batch instead.

### `firecrawl_search` — Web search with content
Search the web and get content from the top results in one call.

```json
{
  "query": "SSLCommerz payment gateway Bangladesh integration guide",
  "limit": 5,
  "scrapeOptions": {
    "formats": ["markdown"],
    "onlyMainContent": true
  }
}
```

**Best for**: When you don't know which website has the information.
**Optimal workflow**: Search first → get URLs → scrape the most relevant one.

### `firecrawl_crawl` — Multi-page site crawl
Crawl an entire website or section, following links.

```json
{
  "url": "https://example.com/docs",
  "maxDiscoveryDepth": 2,
  "limit": 50,
  "allowExternalLinks": false
}
```

**Best for**: Extracting content from many related pages (e.g. full documentation section).
**Warning**: Can return a LOT of content — always set a `limit` and reasonable `maxDiscoveryDepth`.
Use `firecrawl_check_crawl_status` to poll for completion (crawls are async).

### `firecrawl_map` — Discover URLs on a site
Get a list of all indexed URLs on a site without downloading their content.

```json
{
  "url": "https://example.com",
  "includeSubdomains": false,
  "limit": 200
}
```

**Best for**: Discovering which pages exist before deciding what to scrape.
**Pattern**: `map` → pick relevant URLs → `batch_scrape`.

### `firecrawl_extract` — Structured data from multiple pages
Extract specific structured data from one or more URLs using LLM + schema.

```json
{
  "urls": ["https://example.com/page1"],
  "prompt": "Extract the facility name, location, and price per night",
  "schema": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "location": {"type": "string"},
      "price_per_night": {"type": "number"}
    }
  }
}
```

**Best for**: Pulling structured data out of unstructured web pages.

### `firecrawl_check_crawl_status` — Poll async crawl
```json
{ "id": "job-id-from-crawl-response" }
```
Poll every 15–30 seconds. Keep polling for 2–3 minutes before giving up.

## Tool Selection Guide

| Situation | Use This Tool |
|-----------|---------------|
| Single page, know the URL | `firecrawl_scrape` |
| Multiple pages, know all URLs | `firecrawl_batch_scrape` |
| Don't know which site has the info | `firecrawl_search` |
| Need all pages of a docs section | `firecrawl_crawl` |
| Discover URLs before scraping | `firecrawl_map` → `firecrawl_batch_scrape` |
| Need structured data (name, price, etc.) | `firecrawl_extract` |

## Dhara-Specific Use Cases

### Research competitor NGO booking platforms
```json
firecrawl_search: "NGO accommodation booking platform Bangladesh"
→ firecrawl_scrape: top results for design/feature research
```

### Get SSLCommerz payment API docs
```json
firecrawl_scrape: {
  "url": "https://developer.sslcommerz.com/doc/v4/",
  "formats": ["markdown"],
  "onlyMainContent": true
}
```

### Scrape a Supabase doc page for Edge Function patterns
```json
firecrawl_scrape: {
  "url": "https://supabase.com/docs/guides/functions",
  "formats": ["markdown"],
  "onlyMainContent": true,
  "maxAge": 86400000
}
```

### Extract facility data from NGO websites for seed data
```json
firecrawl_extract: {
  "urls": ["https://ngo-site.org/accommodation"],
  "prompt": "Extract accommodation facility name, location, room types and prices",
  "schema": { ... }
}
```

### Map and batch-scrape a documentation site
```json
// Step 1: discover pages
firecrawl_map: { "url": "https://docs.example.com", "limit": 100 }

// Step 2: batch scrape relevant ones
firecrawl_batch_scrape: { "urls": ["...relevant URLs from map..."], "formats": ["markdown"] }
```

## Format Choice

| Format | When to use |
|--------|-------------|
| `markdown` | Reading content, summarizing, feeding to model |
| `json` with schema | Extracting specific structured data |
| `html` | Rarely — only when you need to inspect raw page structure |

**Default**: Use `markdown` with `onlyMainContent: true` — cleanest and most token-efficient.

## Performance Tips

- Add `maxAge: 172800000` (2 days) for pages that don't change frequently — 500% faster via cache
- Set `onlyMainContent: true` always — removes ads, nav, footers that waste tokens
- Keep `limit` low for crawls (10–20 pages) unless you specifically need comprehensive coverage
- Use `batch_scrape` instead of looping `scrape` — it runs in parallel

## Do's ✅
- Always use `onlyMainContent: true` for cleaner results
- Use `firecrawl_search` first when you don't know the exact URL
- Use `firecrawl_map` before crawling a large site
- Poll `firecrawl_check_crawl_status` after starting a crawl (they're async)
- Use JSON format with a schema when you need structured output

## Don'ts ❌
- Don't loop `firecrawl_scrape` over many URLs — use `firecrawl_batch_scrape`
- Don't set `maxDiscoveryDepth` higher than 3 without a very low `limit`
- Don't use `firecrawl_crawl` for a single page — use `firecrawl_scrape`
- Don't use markdown format when you only need specific fields — use JSON schema instead
- Don't scrape pages that require login or authentication — Firecrawl works on public pages
