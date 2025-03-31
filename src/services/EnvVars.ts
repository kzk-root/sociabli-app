const EnvVars = () => {
  const appEnv = import.meta.env.VITE_APP_ENV
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const netlifyFunctions = import.meta.env.VITE_NETLIFY_FUNCTIONS
  const logLevel = import.meta.env.VITE_LOG_LEVEL

  if (!logLevel) {
    throw new Error('Missing VITE_LOG_LEVEL')
  }

  if (!appEnv) {
    throw new Error('Missing VITE_APP_ENV')
  }

  if (!clerkPublishableKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
  }

  if (!netlifyFunctions) {
    throw new Error('Missing VITE_NETLIFY_FUNCTIONS')
  }

  return {
    appEnv,
    clerkPublishableKey,
    netlifyFunctions,
    logLevel,
  }
}

export default EnvVars()
