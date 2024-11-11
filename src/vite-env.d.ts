/// <reference types="vite/client" />

declare const __VERSION__: string

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly N8N_API_URL: string
  readonly N8N_WEBHOOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
