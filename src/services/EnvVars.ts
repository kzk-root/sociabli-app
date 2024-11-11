const EnvVars = () => {
  const appEnv = import.meta.env.VITE_APP_ENV
  const appVersion = __VERSION__
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const netlifyFunctions = import.meta.env.VITE_NETLIFY_FUNCTIONS

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
    appVersion,
    clerkPublishableKey,
    netlifyFunctions,
  }
}

export default EnvVars()
