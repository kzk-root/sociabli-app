import { createClerkClient } from '@clerk/clerk-sdk-node'

type Result<T,E> =
  | {success: true, data: T}
  | {success: false, error: E}

type RetrieveError = {
  message: string
  statusCode: number
}

type RetrieveSuccess = {
  n8nApiKey: string
}

type Params = {
  request: Request
}

// FIXME: use env var wrapper
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_TOKEN })

export default async (params: Params): Promise<Result<RetrieveSuccess, RetrieveError>> => {
  const authHeader = params.request.headers.get('Authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return {success: false, error: {message: 'No token provided', statusCode: 401}}
  }

  try {
    const decoded = await clerkClient.verifyToken(token)

    // Token is valid, you can now access user information
    const userId = decoded.sub

    // retrieve user's private metadata from clerk
    const user = await clerkClient.users.getUser(userId)

    // extract n8n api token
    const privateMetadata = user.privateMetadata;

    if(!privateMetadata.n8nApiKey){
      return {success: false, error: {message: 'User without api key', statusCode: 500}}
    }

    return {
      success: true,
      data: {
        n8nApiKey: privateMetadata.n8nApiKey as string
      }
    }
  } catch (error) {
    return {success: false, error: {message: 'Failed verifying user token', statusCode: 500}}
  }
}
