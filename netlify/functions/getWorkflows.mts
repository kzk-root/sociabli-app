import { Context } from '@netlify/functions'
import { createClerkClient } from '@clerk/clerk-sdk-node'
import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'

const clerkClient = createClerkClient({ secretKey: FunctionEnvVars.clerkToken })

/**
 * Retrieve known workflows to reduce list of allowed connection permutation.
 *
 * @param request
 * @param _context
 */
export default async (request: Request, _context: Context) => {
  console.log('[getWorkflows] Start')

  const authHeader = request.headers.get('Authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    console.log('[getWorkflows] Abort: No token provided')
    return Response.json({ message: 'No token provided' }, { status: 401 })
  }

  try {
    await clerkClient.verifyToken(token)
    console.log('[getWorkflows] Token verified')

    const workflowList = [
      {
        name: 'Mastodon to Bluesky',
        description: 'Sync your Mastodon posts to Bluesky',
        id: 'mastodon_to_bluesky',
        flow: {
          from: { label: 'Mastodon', icon: 'mastodon' },
          to: { label: 'Bluesky', icon: 'bluesky' },
        },
        fields: [
          {
            id: 'connectionFrom',
            name: 'Mastodon Connection',
            type: 'connection',
            connectionType: 'mastodon',
            description: 'Select one of your Mastodon connections',
          },
          {
            id: 'connectionTo',
            name: 'Bluesky Connection',
            type: 'connection',
            connectionType: 'bluesky',
            description: 'Select one of your Bluesky connections',
          },
        ],
      },
    ]

    return Response.json(workflowList)
  } catch (error) {
    console.log('[getWorkflows] Failed fetching data', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return Response.json({ error: `Failed fetching workflows: ${errorMessage}` }, { status: 500 })
  }
}
