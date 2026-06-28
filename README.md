# Dominoyar Score

![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6-646CFF)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Express](https://img.shields.io/badge/Express-4-000000)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1)
![Android](https://img.shields.io/badge/Android-API_34-3DDC84)
![Jetpack Compose](https://img.shields.io/badge/Jetpack_Compose-1.5-4285F4)
![License](https://img.shields.io/badge/License-MIT-green)

RTL Persian domino score app with password auth, disposable quick game modes, minimal profile/settings, and PWA support.

## Features
- Persian RTL mobile-first UI
- Quick game modes for 2-player, 3-player, and 4-player (2v2)
- Auth with email/username/password + Remember Me
- Backend passkey/WebAuthn endpoints for registration and login ceremonies
- Profile and settings pages (profile edit, password change, theme, sound, haptics)
- Session continuation for unfinished quick games
- Installable PWA with explicit user-controlled update flow
- iOS offline continuity path with cached local session recovery
- Distribution hub route for Myket/Web/PWA/direct access links

## Tech Stack
- Frontend: React 19, Vite, TypeScript, Tailwind
- Backend: Express API, Prisma
- Database: PostgreSQL
- Deploy: VPS + Nginx + SSL
- Android: Kotlin, Jetpack Compose, Room, DataStore

## Local Setup
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npx prisma generate
npx prisma migrate dev
```

## Run (Development)
```bash
npm run api:server  # Terminal 1
npm run dev          # Terminal 2
```

## Build
```bash
npm run build
```

## Android Development
```powershell
cd android-native\android-app
.\gradlew.bat assembleDebug
.\gradlew.bat assembleRelease  # Requires keystore
```

## Screenshot Verification
```powershell
npm run test -- tests\screenshot.spec.js  # Web screenshots
.\scripts\dev\android_preview_matrix_windows.cmd  # Android screenshots
```

## Ops Commands
- `npm run ops:env:check`
- `npm run ops:preflight:vps`
- `npm run ops:deploy:vps`
- `npm run ops:rollback:vps`
- `npm run ops:synthetic`
- `npm run ops:parity:vps`
- `npm run ops:scope:check`

## Android Release
- Version: 0.1.0 (debug build available for testing)
- Download: `https://dominoyar.ir/downloads/dominoyar-android-v0.1.0-debug.apk`
- SHA-256: `bfc14547040e4a7e0ddd682b06772db63e342b6fefa91e073b10fcc15d0596df`

## Troubleshooting
- `npx prisma validate` fails with missing DB URL: Ensure `DATABASE_URL` is set in `.env.local`
- PWA update not applying: Trigger update from in-app banner and reload
- VPS preflight SMTP errors: Configure all `SMTP_*` keys together, or leave all empty

## Codebase Memory MCP Integration
The project integrates codebase-memory-mcp for code intelligence:
- Binary: `C:/Users/moros/.local/bin/codebase-memory-mcp.exe`
- MCP settings: `mcp_settings.json`
- Index project: `index_repository({"repo_path": "C:/Projects/morodomino/MoroDomoniScore"})`