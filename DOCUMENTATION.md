# Domino Scorer - Stable Backend Documentation

## 1. Introduction

This document specifies the active stable backend API for Dominoyar.
Authentication is JWT-based (email/username + password).

## 2. Authentication Strategy

### 2.1. JWT (Email/Username + Password)

1. Registration: user signs up with `name`, `username`, `email`, `password`.
2. Login: user authenticates using email or username + password.
3. Session: frontend stores JWT and sends `Authorization: Bearer <token>`.
4. Token validation: all protected endpoints require valid JWT.

### 2.2. Passkey (WebAuthn) Backend

Passkey endpoints are active in the auth router:
- `POST /api/auth/passkey/register/options`
- `POST /api/auth/passkey/register/verify`
- `POST /api/auth/passkey/login/options`
- `POST /api/auth/passkey/login/verify`

WebAuthn RP config is environment-driven:
- `WEBAUTHN_RP_NAME`
- `WEBAUTHN_RP_ID`
- `WEBAUTHN_ORIGIN`

### 2.3. Protected Immortal Admin Account

On API boot, the server upserts one protected superadmin account using env values:
- `IMMORTAL_NAME`
- `IMMORTAL_USERNAME`
- `IMMORTAL_EMAIL`
- `IMMORTAL_PASSWORD`

Protections:
- This account cannot be deleted.
- Email/username of this account cannot be changed.

### 2.4. Email Delivery

Registration and login notifications are sent over SMTP.
Current production target is a dedicated domain mail path:
- `SMTP_HOST=smtp.dominoyar.ir`
- sender addresses under `@dominoyar.ir`
- Auth credentials are optional for local Postfix relay mode (`SMTP_USER` / `SMTP_PASS` may be empty).
- For local relay (`SMTP_HOST=127.0.0.1` or `localhost`), app mailer uses non-TLS local delivery mode.
- Legacy Domino domain (`domino.ariaprojectsdashboard.ir`) is retired from the active Domino ecosystem.

## 3. Database Schema (Prisma)

### `User`
- `id` UUID (PK)
- `name` string
- `username` string (unique)
- `email` string (unique)
- `passwordHash` string
- `role` string (`user` or `superadmin`)
- `createdAt` timestamp

### `Player`
- legacy table still exists in the schema but is not part of the current stable runtime

### `GameNight`
- legacy table still exists in the schema but quick game is currently disposable/local

### `Passkey`
- active passkey credential storage (credential id, public key, counter, metadata)

### `PasskeyChallenge`
- active short-lived challenge tracking for register/login ceremonies

## 4. API Endpoints

All endpoints are under `/api`.

### 4.1. Health
- `GET /api/health` -> `{ status: 'ok' }`

### 4.2. Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### 4.3. Users (Protected)
- `GET /api/users/me` -> current profile
- `PATCH /api/users/me` -> update `name`, `username`, `email`
- `PATCH /api/users/me/password` -> change password

## 5. Stable Product Notes

- Quick game player or team names are disposable input only.
- The current stable runtime does not depend on player CRUD, history CRUD, spectator sync, or alliance APIs.
- Older tables and docs may remain for traceability, but they are outside the active stable web/PWA contract.

## 6. Codebase Memory MCP Integration

### Overview
The project integrates `github.com/DeusData/codebase-memory-mcp` for high-performance code intelligence. The MCP server provides structural analysis across 158 languages with sub-millisecond queries.

### Configuration
- Binary: `C:/Users/moros/.local/bin/codebase-memory-mcp.exe` (v0.8.1)
- MCP settings file: `mcp_settings.json` at project root
- Agent instructions: `.kilo/agent/codebase-memory-mcp.md`

### Available Tools
| Tool | Purpose |
|------|---------|
| `index_repository` | Index codebase into persistent knowledge graph |
| `search_graph` | Structured search by label, name pattern, file pattern |
| `query_graph` | Cypher-like graph queries (read-only subset) |
| `trace_path` | BFS traversal - who calls a function and what it calls |
| `get_code_snippet` | Read source code for a function by qualified name |
| `get_architecture` | Codebase overview: languages, packages, routes, clusters |
| `search_code` | Grep-like text search within indexed files |
| `detect_changes` | Map git diff to affected symbols with risk classification |
| `manage_adr` | CRUD for Architecture Decision Records |
| `list_projects` | List all indexed projects with node/edge counts |

### Usage Workflow
1. On first session, index the project: use `index_repository` with the project root path
2. For code exploration, use MCP tools before file reads for token efficiency
3. When making changes, run `detect_changes` to understand blast radius
4. For architecture questions, use `get_architecture` for an overview

### Storage
- Cache directory: `%USERPROFILE%\.cache\codebase-memory-mcp\`
- Persists SQLite databases in WAL mode for ACID safety

## 7. Android Distribution Configuration

### Environment Variables
- `VITE_MYKET_APP_URL` - Myket store listing URL (default: `https://myket.ir/app/com.morodomino.android`)
- `VITE_ENABLE_BAZAAR` - Enable Cafe Bazaar secondary store (`true`/`false`)
- `VITE_BAZAAR_APP_URL` - Cafe Bazaar listing URL (when dual-store enabled)
- `VITE_DIRECT_DOWNLOAD_URL` - Controlled direct APK download URL
- `VITE_DIRECT_DOWNLOAD_SHA256_URL` - SHA-256 verification file URL
- `VITE_ANDROID_RELEASE_VERSION` - Android app version string (format: `major.minor.patch`)
- `VITE_ANDROID_RELEASE_DATE` - Release date (format: `YYYY-MM-DD`)
- `VITE_ANDROID_RELEASE_SHA256` - 64-character hex SHA-256 hash
- `VITE_ANDROID_RELEASE_SIZE_BYTES` - APK file size in bytes

### Release Verification
Direct download requires all six metadata keys to be set together:
- If any of `VITE_ANDROID_RELEASE_*` keys are set, all must have valid values
- SHA-256 hash should be verified against download before installation
- Download path serves debug builds; production releases go through Myket store

### Android App Structure
- `android-native/android-app/` - Native Android app module
- `android-native/specs/` - Design system and parity specifications
- `android-native/contracts/` - Frontend-backend parity contracts
- `android-native/compliance/` - Release checklists and compliance docs

### Build Commands
```powershell
cd .\android-native\android-app
.\gradlew.bat assembleDebug
.\gradlew.bat assembleRelease  # Requires keystore
```

### Current Release (Debug Build)
- Version: 0.1.0
- APK: `https://dominoyar.ir/downloads/dominoyar-android-v0.1.0-debug.apk`
- SHA-256: `bfc14547040e4a7e0ddd682b06772db63e342b6fefa91e073b10fcc15d0596df`
