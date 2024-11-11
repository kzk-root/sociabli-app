const n8nApiUrl = process.env.N8N_API_URL
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
const n8nReceiveToken = process.env.N8N_RECEIVE_TOKEN
const n8nSecret = process.env.N8N_SECRET

const clerkToken = process.env.CLERK_TOKEN

if (!n8nApiUrl) {
  throw new Error('N8N_API_URL is not defined')
} else {
  console.log('N8N_API_URL:', n8nApiUrl)
}

if (!n8nWebhookUrl) {
  throw new Error('N8N_WEBHOOK_URL is not defined')
} else {
  console.log('N8N_WEBHOOK_URL:', n8nWebhookUrl)
}

if (!n8nReceiveToken) {
  throw new Error('N8N_RECEIVE_TOKEN')
} else {
  console.log('N8N_RECEIVE_TOKEN set')
}

if (!n8nSecret) {
  throw new Error('N8N_SECRET is not defined')
} else {
  console.log('N8N_SECRET set')
}

if (!clerkToken) {
  throw new Error('CLERK_TOKEN is not defined')
} else {
  console.log('CLERK_TOKEN set')
}

const FunctionEnvVars = {
  n8nApiUrl,
  n8nWebhookUrl,
  n8nReceiveToken,
  n8nSecret,
  clerkToken,
}

export default FunctionEnvVars
