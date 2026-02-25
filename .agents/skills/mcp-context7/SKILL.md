---
name: mcp-context7
description: >
  Use the Context7 MCP server to fetch version-specific, up-to-date documentation and working
  code examples for any library or framework directly into the coding context. Use this skill
  when writing code that uses Next.js, React, Supabase, Shadcn UI, Tailwind CSS, Zod,
  React Hook Form, date-fns, or any other library where the exact API or patterns matter.
  Trigger by adding "use context7" to any coding prompt, or proactively use it before
  implementing any feature that relies on a specific library version. Prefer Context7 over
  guessing from training data — it prevents hallucinated APIs and deprecated patterns.
  Use alongside mcp-ref for comprehensive documentation coverage.
---

# Context7 MCP Skill

Context7 injects fresh, version-specific documentation and code examples from official sources
directly into your coding context. It solves the #1 problem with AI coding: stale training data
causing hallucinated APIs, renamed methods, and deprecated patterns.

## Two-Step Workflow

Context7 always works in two steps:

### Step 1: `resolve-library-id`
Converts a library name to a Context7-compatible ID.

```
Input: "next.js"
Output: "/vercel/next.js" (or "/vercel/next.js/v15.0.0" for a specific version)
```

**You must call this first** unless the user already provides an ID like `/supabase/supabase`.

### Step 2: `get-library-docs`
Fetches actual documentation using the resolved ID.

```
Inputs:
  - context7CompatibleLibraryID: "/vercel/next.js"  (from step 1)
  - topic: "middleware"                               (optional — narrows results)
  - tokens: 5000                                      (default, max ~10000)
```

Returns: Version-accurate documentation chunks + working code examples.

## Key Libraries for Dhara (with Context7 IDs)

| Library | Context7 ID | Key Topics |
|---------|-------------|------------|
| Next.js | `/vercel/next.js` | app-router, middleware, server-actions, routing |
| Supabase JS | `/supabase/supabase` | auth, realtime, storage, rls |
| Supabase SSR | `/supabase/ssr` | createServerClient, createBrowserClient, cookies |
| React | `/facebook/react` | hooks, server-components, use-client |
| Shadcn UI | `/shadcn-ui/ui` | components, form, installation |
| Tailwind CSS | `/tailwindlabs/tailwindcss` | configuration, utilities, dark-mode |
| Zod | `/colinhacks/zod` | schemas, validation, inference |
| React Hook Form | `/react-hook-form/react-hook-form` | useForm, Controller, FormProvider |
| date-fns | `/date-fns/date-fns` | format, differenceInDays, isWithinInterval |
| Lucide React | `/lucide-icons/lucide` | icons, usage |

> **Tip**: If you know the exact ID, skip `resolve-library-id` and go straight to `get-library-docs`.
> Example: `get-library-docs("/supabase/supabase", topic: "google oauth")`

## When to Use Context7

### Before implementing any feature involving a library
```
"Implement Supabase Google OAuth callback in Next.js App Router. use context7"
→ resolve: "supabase ssr" → /supabase/ssr
→ get-library-docs: topic "oauth callback google"
→ now write the implementation with fresh docs
```

### When a library's API has likely changed
```
"How does Next.js 15 handle cookies in server components? use context7"
→ resolve: "next.js" → /vercel/next.js
→ get-library-docs: topic "cookies server components"
```

### When you're unsure about exact method signatures
```
"What are all the options for Supabase createServerClient? use context7"
→ get-library-docs("/supabase/ssr", topic: "createServerClient options")
```

## Dhara-Specific Context7 Prompts

```
// Middleware with Supabase session refresh
"Write Next.js middleware that refreshes Supabase auth session. use context7 /supabase/ssr"

// Server Action with form
"Create a Server Action for booking form submission with react-hook-form validation. use context7"

// Availability calendar with react-day-picker
"Implement a date range picker that disables blocked dates. use context7"

// Shadcn Form with Zod
"Build a Shadcn UI Form with Zod schema validation and error messages. use context7 /shadcn-ui/ui"

// Supabase Realtime subscription
"Subscribe to new messages in a Supabase Realtime channel. use context7 /supabase/supabase"

// Supabase Storage upload
"Upload a file to Supabase Storage from a Next.js Server Action. use context7"

// Next.js generateMetadata for facility page
"Use generateMetadata in Next.js for dynamic OG tags on a facility listing page. use context7"

// Google OAuth with Supabase
"Implement Google OAuth sign-in with Supabase, store role in cookie before redirect. use context7"
```

## Comparison: Context7 vs Ref

Both tools provide documentation. Use the right one:

| Use Case | Context7 | Ref |
|----------|----------|-----|
| Version-specific library docs | ✅ Best | ✅ Good |
| Code examples & patterns | ✅ Best | ✅ Good |
| Obscure or niche libraries | ⚠️ May not have it | ✅ Broader coverage |
| Private repos / PDFs | ❌ No | ✅ Yes |
| Token efficiency | Good (5k default) | ✅ Better (up to 95% fewer tokens) |
| Natural language search | Needs library name first | ✅ Full NL queries |

**Recommended**: Use Context7 as your first choice for known, popular libraries. Fall back to
Ref for deeper dives, niche libraries, or when Context7 doesn't have what you need.

## Auto-Invoke Rule (add to your project rules)

Add this to your Claude/Cursor rules to auto-trigger Context7:

```
Always use Context7 MCP tools before planning or implementing code that involves 
external libraries or frameworks. Call resolve-library-id then get-library-docs 
before writing any feature that uses Next.js, Supabase, Shadcn UI, or any npm package.
This applies to any library usage, API integration, or framework-specific patterns.
```

## Do's ✅
- Always call `resolve-library-id` first when you don't know the exact ID
- Use the `topic` parameter to narrow results — don't just fetch all docs
- Use Context7 before writing any Supabase auth, storage, or realtime code
- When Next.js App Router patterns are involved, always check with Context7
- Limit `tokens` to 5000 unless you specifically need more — higher = more context rot

## Don'ts ❌
- Don't skip Context7 when writing code for major libraries — training data goes stale fast
- Don't call `get-library-docs` more than 3 times per task — summarize and use what you have
- Don't include API keys, passwords, or sensitive data in queries (they're logged server-side)
- Don't use Context7 for general research or news — it's only for library documentation
- Don't guess at library IDs — always `resolve-library-id` first if unsure
