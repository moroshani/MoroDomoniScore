# Dominoyar Score

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express](https://img.shields.io/badge/Express-4-black)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Primary-336791)

RTL Persian domino score app with password auth, disposable quick game modes, minimal profile/settings, and PWA support.

## Features
- Persian RTL mobile-first UI.
- Quick game modes for 2-player, 3-player, and 4-player (2v2).
- Auth with email/username/password + Remember Me.
- Backend passkey/WebAuthn endpoints for registration and login ceremonies.
- Profile and settings pages (profile edit, password change, theme, sound, haptics).
- Session continuation for unfinished quick games.
- Installable PWA (manifest + service worker + offline page) with explicit user-controlled update flow.
- iOS offline continuity path with cached local session recovery after first successful online sign-in.
- Distribution hub route for Myket/Web/PWA/direct access links.

## Tech Stack
- Frontend: React 19, Vite, TypeScript, Tailwind (build pipeline).
- Backend: Express API, Prisma.
- Database: PostgreSQL.
- Deploy: VPS + Nginx + SSL.

## Local Setup
1. Install dependencies:
   - `npm install`
2. Create local environment file:
   - `cp .env.example .env.local`
3. Fill required values in `.env.local`:
   - `DATABASE_URL`, `JWT_SECRET`, `VITE_API_URL`
   - `IMMORTAL_NAME`, `IMMORTAL_USERNAME`, `IMMORTAL_EMAIL`, `IMMORTAL_PASSWORD`
   - SMTP values if email notifications are enabled
4. Generate Prisma client:
   - `npx prisma generate`
5. Apply migrations:
   - `npx prisma migrate dev`

## Run (Development)
Open separate terminals:
1. API server: `npm run api:server`
2. Frontend: `npm run dev`

## Build
- `npm run build`

## Ops Commands
- `npm run ops:env:check`
- `npm run ops:preflight:vps`
- `npm run ops:deploy:vps`
- `npm run ops:rollback:vps`
- `npm run ops:synthetic`
- `npm run ops:parity:vps`
- `npm run ops:scope:check`
- `npm run ops:tls:audit`
- `npm run ops:dr:verify`

## Deployment (VPS)
1. Run preflight gate:
   - `npm run ops:preflight:vps`
2. Deploy release (includes build, migrate, promote, synthetic checks, and parity):
   - `npm run ops:deploy:vps`
3. Optional rollback drill or emergency rollback:
   - `npm run ops:rollback:vps`

## Troubleshooting
- `npx prisma validate` fails with missing DB URL:
  - Ensure `DATABASE_URL` is set in `.env.local` or shell environment.
- PWA update not applying:
  - Trigger update from in-app update banner and reload once service worker takes control.
- VPS preflight fails on SMTP keys:
  - Configure all `SMTP_*` keys together, or leave all `SMTP_*` keys empty.

## Codebase Memory MCP Integration

The project supports codebase-memory-mcp for enhanced code intelligence.

### Setup
The MCP server is installed at `C:/Users/moros/.local/bin/codebase-memory-mcp.exe` and configured in:
- `mcp_settings.json` - Kilo MCP configuration
- `.kilo/agent/codebase-memory-mcp.md` - Agent instructions

### Tools Available
- `index_repository` - Index codebase into knowledge graph
- `search_graph` - Structured search by name/pattern/label
- `query_graph` - Cypher-like graph queries
- `trace_path` - Call chain resolution
- `get_code_snippet` - Source code retrieval
- `get_architecture` - Codebase overview
- `detect_changes` - Git diff impact analysis
- `manage_adr` - Architecture Decision Records

### Recommended Workflow
1. First session: Index the project with `index_repository`
2. Code questions: Use MCP tools before file reads
3. Changes: Run `detect_changes` to identify affected symbols

## Notes
- Production DB is PostgreSQL.
- Quick game setup is disposable and does not create or save players.
- Gemini/AI integrations are intentionally removed from this project.
- Passkey is active in backend API and Android roadmap implementation.
- API bootstraps one protected superadmin account from `IMMORTAL_*` env values.
