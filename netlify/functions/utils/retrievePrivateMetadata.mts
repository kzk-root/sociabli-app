import { createClerkClient } from '@clerk/clerk-sdk-node'
import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'

type Result<T, E> = { success: true; data: T } | { success: false; error: E }

type RetrieveError = {
  message: string
  statusCode: number
  error?: unknown
}
export type MainWebhook = {
  path: string
  credential: string
}
type RetrieveSuccess = {
  n8nApiKey: string
  userId: string
  n8nMainWorkflowId: string
  mainWebhook: MainWebhook
}

type Params = {
  request: Request
}

const clerkClient = createClerkClient({ secretKey: FunctionEnvVars.clerkToken })

/**
 * Validate JWT and extract user metadata.
 *
 * @param params
 */
export default async (params: Params): Promise<Result<RetrieveSuccess, RetrieveError>> => {
  const authHeader = params.request.headers.get('Authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return { success: false, error: { message: 'No token provided', statusCode: 401 } }
  }

  try {
    const decoded = await clerkClient.verifyToken(token)

    // Token is valid, you can now access user information
    const userId = decoded.sub

    // retrieve user's private metadata from clerk
    const user = await clerkClient.users.getUser(userId)

    // extract n8n api token
    const privateMetadata = user.privateMetadata

    if (!privateMetadata.n8nApiKey) {
      return { success: false, error: { message: 'User without api key', statusCode: 500 } }
    }

    return {
      success: true,
      data: {
        userId,
        n8nApiKey: privateMetadata.n8nApiKey as string,
        n8nMainWorkflowId: privateMetadata.n8nMainWorkflowId as string,
        mainWebhook: privateMetadata.mainWebhook as MainWebhook,
      },
    }
  } catch (error) {
    console.log('Failed to verify token with error', error)
    return {
      success: false,
      error: { message: 'Failed verifying user token', statusCode: 500, error },
    }
  }
}
