const n8nApiUrl = process.env.N8N_API_URL
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
const n8nReceiveToken = process.env.N8N_RECEIVE_TOKEN
const n8nSecret = process.env.N8N_SECRET

const mastodonAppRedirectUrl = process.env.MASTODON_APP_REDIRECT_URL
const mastodonAppScopes = process.env.MASTODON_APP_SCOPES

const clerkToken = process.env.CLERK_TOKEN

const supabaseKey = process.env.SUPABASE_KEY

if (!n8nApiUrl) {
  throw new Error('N8N_API_URL is not defined')
}

if (!n8nWebhookUrl) {
  throw new Error('N8N_WEBHOOK_URL is not defined')
}

if (!n8nReceiveToken) {
  throw new Error('N8N_RECEIVE_TOKEN')
}

if (!n8nSecret) {
  throw new Error('N8N_SECRET is not defined')
}

if (!clerkToken) {
  throw new Error('CLERK_TOKEN is not defined')
}

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY is not defined')
}

if (!mastodonAppRedirectUrl) {
  throw new Error('MASTODON_APP_REDIRECT_URL is not defined')
}

if (!mastodonAppScopes) {
  throw new Error('MASTODON_APP_SCOPES is not defined')
}

const FunctionEnvVars = {
  n8nApiUrl,
  n8nWebhookUrl,
  n8nReceiveToken,
  n8nSecret,
  clerkToken,
  mastodonAppRedirectUrl,
  mastodonAppScopes,
  supabaseKey,
}

export default FunctionEnvVars
