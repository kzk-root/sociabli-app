import { Context } from '@netlify/functions'
import { createClerkClient } from '@clerk/clerk-sdk-node'
import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'

const clerkClient = createClerkClient({ secretKey: FunctionEnvVars.clerkToken })

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
          from: { label: 'Mastodon', icon: 'MastodonIcon' },
          to: { label: 'Bluesky', icon: 'BlueskyIcon' },
        },
        fields: [
          {
            id: 'mastodonInstance',
            name: 'Mastodon Instance',
            type: 'url',
            description: 'For example: https://mastodon.social',
            placeholder: 'https://mastodon.social',
          },
          {
            id: 'mastodonUser',
            name: 'Mastodon Username',
            type: 'text',
            description: '@username',
            errorHint: 'The username should be in the format @username',
            pattern: '^@(.*)$',
            placeholder: '@username',
          },
          {
            id: 'blueskyUserHandle',
            name: 'Bluesky User handle',
            type: 'text',
            description:
              'For example: USERNAME.bsky.social - use the full identifier domain bsky.social or your custom domain',
            errorHint:
              'The handle should be in the format USERNAME.bsky.social or your custom domain',
            pattern: '^[a-zA-Z0-9_\\-]{1,60}\\.[a-zA-Z0-9_]{2,}\\.[a-zA-Z]{2,}$',
            placeholder: 'USERNAME.bsky.social or your custom domain',
          },
          {
            id: 'blueskyAccessToken',
            name: 'Bluesky Token',
            link: {
              href: 'https://bsky.app/settings/app-passwords',
              text: 'To Bluesky settings',
            },
            type: 'password',
            placeholder: 'xxxx-xxxx-xxxx-xxxx',
            description: 'You can get your token from Bluesky settings',
            errorHint: 'The token should be in the format xxxx-xxxx-xxxx-xxxx',
            pattern: '^[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}$',
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
