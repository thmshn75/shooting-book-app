# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Arbeitsweise (verbindlich)

1. **Claude plant** — Codebase analysieren, Implementierungsplan erstellen
2. **Claude schreibt `CODEX_TASK.md`** — exakte Änderungsanweisungen (Datei, Zeile, Code) in die Datei `CODEX_TASK.md` im Projektroot schreiben, dann dem User melden dass Codex loslegen kann
3. **Codex setzt um** — Codex liest `CODEX_TASK.md` und führt alle Änderungen aus
4. **Claude prüft, committet und pusht** — Änderungen reviewen, dann `git commit` + `git push`, danach `CODEX_TASK.md` löschen

Claude schreibt keinen Code selbst, außer für triviale Einzeiler oder Korrekturen nach dem Codex-Durchlauf.

Der User übergibt Codex den Auftrag mit: *"Lies `CODEX_TASK.md` und setze alles darin um."*

## Commands

```bash
npm run dev        # Start dev server (Vite, hot reload)
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

No test suite exists. No linter is configured.

## Environment

Copy `.env.example` to `.env` and fill in the two variables before running locally:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Architecture

This is a **single-page vanilla JS app** with no framework. There are only two source files:

- [src/main.js](src/main.js) — ~2960 lines, contains the entire application logic
- [src/style.css](src/style.css) — all styles
- [index.html](index.html) — minimal shell with `<div id="app">` entry point

The HTML structure is injected as a large template literal at the top of `main.js` (lines ~9–390). All DOM element references are queried immediately after (`getElementById` calls, lines ~390–470) and held as module-level constants.

### Data layer

Backend is **Supabase** (Postgres + Auth). The client is initialised once at the top of `main.js`. All database access uses the Supabase JS client directly — there is no abstraction layer.

**Supabase tables:**

| Table | Purpose |
|---|---|
| `entries` | One row per training or competition session |
| `entry_blocks` | One or more blocks per entry (weapon + discipline + shots-per-series config) |
| `entry_series` | Individual series scores within a block |
| `disciplines` | User-owned discipline list |
| `weapons` | User-owned weapon list (name, type, caliber, notes) |

All rows carry `user_id` and every query filters by the logged-in user's `user_id` (RLS pattern enforced in queries even if Supabase RLS is also active).

### App state

Three module-level caches hold the data in memory:
- `allEntriesCache` — all entries + their blocks/series (joined on load)
- `disciplinesCache` — user's disciplines
- `weaponsCache` — user's weapons

`editingEntryId` / `editingOriginTab` track inline edit state.

### UI patterns

- **Tabs**: `activateTab('entry'|'stats'|'list')` and `activateStatsSubTab('summary'|'charts'|'details')`
- **Status messages**: `setStatus(element, message, type, options)` / `clearStatus(element)`. Type values are `'info'`, `'success'`, `'error'`. Pass `{ autoClear: true }` to auto-dismiss.
- **Collapsible panels**: discipline panel, weapon panel, stats filter, list filter — each has a dedicated open/close helper function.
- **Charts**: rendered as pure DOM/CSS bar charts via `renderBarChart()` (no chart library).
- **Export**: uses `exceljs` to generate `.xlsx` downloads directly in the browser.

### Entry types

- `training` — has duration (minutes), no score
- `competition` — has mode (`static`|`dynamic`), max score; dynamic mode also stores a time in seconds

### PWA

The app is configured as an installable PWA via [public/site.webmanifest](public/site.webmanifest) with standalone display mode and theme color `#35393f`.

### Auth / Login

Login and registration are two separate views within the same screen area, toggled via JS (`display` swap). The login view is shown by default.

**Login view** (`#auth-box`): A native `<form id="login-form" autocomplete="on">` with:
- Email input: `name="username"`, `autocomplete="username"`, `type="email"`
- Password input: `name="password"`, `autocomplete="current-password"`, `type="password"`
- Submit button: `id="login-btn"`, `type="submit"`
- Secondary link buttons: "Neues Konto erstellen" (→ register view), "Passwort vergessen?"
- Status paragraph: `#auth-status`

**Register view** (`#register-box`, hidden by default): A native `<form id="register-form" autocomplete="on">` with:
- Email input: `name="username"`, `autocomplete="username"`
- Password input: `name="new-password"`, `autocomplete="new-password"`
- Submit button: `id="register-btn"`, `type="submit"`
- Link button: "Zurück zum Login" (→ login view)
- Status paragraph: `#register-status`

Event listeners use `form.addEventListener('submit', ...)` with `event.preventDefault()` — not button click handlers. This enables native browser autofill and Enter-key submission.

The `forgotPasswordBtn` reads from `loginEmailInput` (pre-filled from the login form).
