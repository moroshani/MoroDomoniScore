<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

Modernised Domino Helper now expects Supabase for authentication and storage while remaining deployable on shared hosting. Use these instructions to run or build the app locally.

## Run Locally

**Prerequisites:**  Node.js 18+

1. Install dependencies (if the network blocks npm, add packages manually to `package.json`):
   ```bash
   npm install
   ```
2. Create `.env.local` with the required keys:
   ```bash
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The app registers a service worker automatically, so open it on `http://localhost:5173` to test PWA install and offline behaviour.

## Production build

```
npm run build
```

The generated `dist/` folder can be uploaded to shared hosting. Ensure the same Supabase environment variables are injected at build time.
