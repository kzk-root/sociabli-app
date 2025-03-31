/// <reference types="vite/client" />

import { LogLevelDesc } from 'loglevel'

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_NETLIFY_FUNCTIONS: string
  readonly VITE_LOG_LEVEL: LogLevelDesc
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
