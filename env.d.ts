/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY?: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
