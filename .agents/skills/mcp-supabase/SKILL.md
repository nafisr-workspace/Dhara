---
name: mcp-supabase
description: >
  Use the Supabase MCP server to manage the Dhara project's database, schema, migrations,
  Edge Functions, storage, and project config — all without leaving the chat. Use this skill
  whenever you need to: create or alter database tables, apply or list migrations, run SQL queries,
  generate TypeScript types, fetch project config (URL, anon key), get service logs, deploy Edge
  Functions, manage storage buckets, or create/manage database branches for safe development.
  Always use this skill instead of asking the user to manually run Supabase CLI commands or
  open the Supabase dashboard, whenever an MCP action can do the job instead.
---

# Supabase MCP Skill

The Supabase MCP server connects directly to your Supabase project and lets you manage it
through natural language. Think of it as having the Supabase dashboard and CLI both available
as tool calls.

## Available Tool Groups

### 📁 Database Tools
The most-used group for Dhara development.

| Tool | When to use |
|------|-------------|
| `list_tables` | Inspect the current schema — list all tables in `public` schema |
| `list_migrations` | See which migrations have been applied |
| `apply_migration` | **Use for ALL DDL** (CREATE TABLE, ALTER TABLE, CREATE INDEX, RLS policies) — tracked in migration history |
| `execute_sql` | Run read queries (SELECT), or quick non-schema writes — NOT tracked as a migration |
| `list_extensions` | Check which Postgres extensions are enabled |
| `generate_typescript_types` | Regenerate `src/types/database.ts` after schema changes |

> **Critical rule**: Always use `apply_migration` for any schema change (DDL). Never use
> `execute_sql` to create or alter tables — those changes won't be tracked.

### 🔑 Project Config Tools

| Tool | When to use |
|------|-------------|
| `get_project` | Get project details, URL, anon key |
| `get_project_url` | Fetch the Supabase project URL |
| `get_anon_key` | Fetch the public anon key |

Use these to populate `.env.local` or verify config without going to the dashboard.

### 📋 Logs & Debugging

| Tool | When to use |
|------|-------------|
| `get_logs` | Fetch logs by service: `api`, `postgres`, `edge-functions`, `auth`, `storage`, `realtime` |

Use `get_logs` to debug:
- Auth errors → service: `auth`
- Slow queries or DB errors → service: `postgres`
- Edge Function failures → service: `edge-functions`
- Storage upload issues → service: `storage`

### ⚡ Edge Functions

| Tool | When to use |
|------|-------------|
| `list_edge_functions` | See all deployed functions |
| `deploy_edge_function` | Deploy or update a function from `supabase/functions/` |

### 🌿 Branching (Paid plan required)

| Tool | When to use |
|------|-------------|
| `create_branch` | Create a dev branch to test schema changes safely |
| `list_branches` | See all branches |
| `merge_branch` | Promote a branch's migrations to production |
| `reset_branch` | Roll back a branch to a clean state |
| `delete_branch` | Clean up unused branches |

> Use branches when making risky schema changes to Dhara (e.g. dropping columns,
> restructuring availability logic). Never test destructive migrations directly on production.

### 🗂️ Storage (disabled by default — enable with `features=storage`)

| Tool | When to use |
|------|-------------|
| `list_storage_buckets` | See all buckets (facility-photos, room-photos, etc.) |
| `get_storage_config` | Check storage settings |

### 📚 Docs Search

| Tool | When to use |
|------|-------------|
| `search_docs` | Search Supabase's official documentation inline — great for checking RLS syntax, auth patterns, Edge Function APIs |

## Dhara-Specific Workflows

### Initial Schema Setup
```
1. apply_migration → create all tables from dhara-backend skill schema
2. apply_migration → add RLS policies
3. apply_migration → add indexes
4. generate_typescript_types → save to src/types/database.ts
```

### Adding a New Table
```
1. apply_migration → "create table [name] ..."
2. apply_migration → "alter table [name] enable row level security; create policy ..."
3. generate_typescript_types → regenerate types
```

### Debugging a Failed Booking
```
1. execute_sql → "SELECT * FROM bookings WHERE id = '...'"
2. get_logs → service: 'postgres' (check for constraint violations)
3. get_logs → service: 'edge-functions' (check post-checkout function)
```

### Deploying an Edge Function
```
1. list_edge_functions → confirm function exists or needs creating
2. deploy_edge_function → deploy from supabase/functions/[name]/
3. get_logs → service: 'edge-functions' → verify no errors
```

### Regenerate TypeScript Types
After any schema change, always run:
```
generate_typescript_types → save output to src/types/database.ts
```
This keeps the typed Supabase client in sync with the actual schema.

## Security Rules When Using This MCP

- **Never connect to production with write access** — use a dev project or branch
- **Always review SQL before confirming** — the MCP will show you what it's about to run
- **Read-only mode** is available: add `?read_only=true` to the MCP URL for safety
- **Project scoping**: The MCP should be scoped to the Dhara project ref only
  — this prevents accidental changes to other projects

## Useful Patterns

### Check if availability overlap exists (debug query)
```sql
-- execute_sql:
SELECT * FROM availability_blocks
WHERE room_id = '[room-id]'
AND daterange(start_date, end_date, '[]') &&
    daterange('[checkin]'::date, '[checkout]'::date, '[]');
```

### Check bookings for a specific date range
```sql
-- execute_sql:
SELECT b.*, p.full_name, r.name as room_name
FROM bookings b
JOIN profiles p ON p.id = b.guest_id
JOIN rooms r ON r.id = b.room_id
WHERE b.checkin_date <= '[checkout]'::date
  AND b.checkout_date >= '[checkin]'::date
  AND b.status != 'cancelled';
```

### List all tables with row counts
```sql
-- execute_sql:
SELECT schemaname, tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

## Do's ✅
- Use `apply_migration` for every schema change — keep history clean
- Run `generate_typescript_types` after every schema change
- Use `get_logs` before asking why something is broken
- Use `search_docs` when unsure about Supabase RLS or auth syntax
- Use branches for any risky or experimental schema work

## Don'ts ❌
- Never use `execute_sql` for CREATE TABLE, ALTER TABLE, or policy changes
- Never connect the MCP to production with write access
- Never skip regenerating TypeScript types after schema changes
- Never drop a table or column without branching first
