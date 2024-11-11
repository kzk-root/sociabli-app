/// <reference types="vite/client" />

declare const __VERSION__: string

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_NETLIFY_FUNCTIONS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
