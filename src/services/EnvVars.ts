const EnvVars = () => {
  const appEnv = import.meta.env.VITE_APP_ENV
  const appVersion = __VERSION__
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!appEnv) {
    throw new Error('Missing VITE_APP_ENV')
  }

  if (!apiBaseUrl) {
    throw new Error('Missing VITE_API_BASE_URL')
  }

  if (!clerkPublishableKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
  }

  return {
    appEnv,
    appVersion,
    apiBaseUrl,
    clerkPublishableKey,
  }
}

export default EnvVars()
