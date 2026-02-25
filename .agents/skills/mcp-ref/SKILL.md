---
name: mcp-ref
description: >
  Use the Ref MCP server (ref.tools) to look up token-efficient, up-to-date technical
  documentation for any library, API, or framework used in the Dhara project. Use this skill
  whenever you need to check API docs, find correct method signatures, look up configuration
  options, or verify how a library works — especially for Next.js App Router, Supabase JS/SSR,
  Shadcn UI, Tailwind CSS, React Hook Form, Zod, date-fns, SSLCommerz, or any other dependency.
  Always prefer Ref over guessing from training data to avoid hallucinated or outdated APIs.
  Use this instead of web_search when the goal is specifically finding technical documentation
  or code examples for a known library.
---

# Ref MCP Skill (ref.tools)

Ref is a documentation search MCP that gives the AI coding agent access to up-to-date,
token-efficient technical docs. It's purpose-built for coding agents — searches are designed
to match how models think, and results are pre-chunked to return only the relevant tokens
(not entire 20k-token doc pages).

## Tools

### `ref_search_documentation(query)`
Search across thousands of public documentation sites and GitHub repos.

- `query` (required): A full natural language question or sentence — NOT keywords.
  - ✅ `"How do I use createServerClient from @supabase/ssr in Next.js App Router?"`
  - ✅ `"What are the required fields for SSLCommerz payment initiation POST request?"`
  - ❌ `"supabase auth"` (too vague — use a full question)

Returns: Relevant documentation snippets, deep links to specific doc sections, code examples.

Ref tracks your search trajectory within a session — it never returns the same result twice,
so you can refine and dig deeper by adjusting the query rather than paging.

### `ref_read_url(url)`
Fetch a specific documentation URL and convert it to clean markdown, filtered by your
session's search history to return only the most relevant sections (up to ~5k tokens).

Use when:
- `ref_search_documentation` returns a promising URL and you want the full details
- You have a direct link to a doc page and want to read it cleanly
- You need to verify an exact API signature or config option

## When to Use Ref

### ✅ Always use Ref for:

**Next.js App Router patterns**
- Server Components vs Client Components rules
- `cookies()`, `headers()`, `redirect()`, `notFound()` server APIs
- Route handlers, middleware, `generateMetadata`
- `next/image`, `next/font`, `next/navigation`

**Supabase JS & SSR**
- `@supabase/ssr` — `createServerClient`, `createBrowserClient` exact signatures
- Auth methods: `signInWithOAuth`, `exchangeCodeForSession`, `getUser`
- Realtime subscriptions, storage upload APIs
- RLS helper patterns

**Shadcn UI**
- Component props, variants, and correct import paths
- Form + react-hook-form + zod integration patterns
- `cn()` utility usage

**Tailwind CSS**
- Specific utility class names when unsure
- `tailwind.config.ts` options (e.g. extending theme, CSS variables)
- Dark mode config

**React Hook Form + Zod**
- `useForm`, `FormProvider`, `Controller` patterns
- Schema definitions and type inference

**date-fns**
- Date formatting, comparison, range utilities
- `format`, `differenceInDays`, `isWithinInterval`, `eachDayOfInterval`

**SSLCommerz (payment gateway)**
- Exact POST payload fields for payment initiation
- IPN/webhook verification endpoint and parameters
- Refund API structure

**Supabase Edge Functions (Deno)**
- Deno-compatible import patterns
- Edge Function request/response handling

## Dhara-Specific Search Examples

```
// Next.js middleware with Supabase SSR
"How to write Next.js middleware that refreshes Supabase session using @supabase/ssr"

// Availability calendar
"How to use react-day-picker to disable specific date ranges"

// Supabase Realtime for messages
"Supabase Realtime channel subscription for new rows in a table"

// Storage upload
"Supabase Storage upload file from browser using @supabase/ssr client"

// Shadcn form with zod
"Shadcn UI Form component with react-hook-form and zod validation example"

// Server Actions with redirect
"Next.js App Router Server Action with redirect after form submit"

// OAuth callback
"Supabase Google OAuth exchangeCodeForSession in Next.js route handler"
```

## Token Efficiency Tips

- Ref returns a maximum of ~5k tokens per read — far less than raw web fetching
- For complex topics, do a search first, then read 1–2 of the most relevant URLs
- In a single session, Ref remembers what you've already seen — refine queries to go deeper
- Prefer Ref over `web_fetch` for documentation — Ref's chunking is much more token-efficient

## Do's ✅
- Always write queries as full questions, not keywords
- Use `ref_read_url` after searching to get exact API details
- Use Ref before writing any code that uses an external library
- When the Supabase client API feels uncertain, check with Ref first

## Don'ts ❌
- Don't use short keyword queries — they produce poor results
- Don't use Ref for general research or news (use web_search instead)
- Don't skip Ref when writing Supabase SSR auth code — the API changes frequently
- Don't include API keys or credentials in search queries (they are logged)
