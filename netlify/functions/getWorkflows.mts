import { Context } from '@netlify/functions'
import { createClerkClient } from '@clerk/clerk-sdk-node'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_TOKEN })

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
        name: 'Weblog to Medium',
        description: 'Each blog entry will be published on Medium',
        id: 'blog_to_medium',
        fields: [
          {
            id: 'mediumAccessToken',
            name: 'Medium Token',
            type: 'password',
            description: 'You can get your token from https://medium.com/me/settings',
          },
        ],
      },
      {
        name: 'Mastodon to Bluesky',
        description: 'Sync your Mastodon posts to Bluesky',
        id: 'mastodon_to_bluesky',
        fields: [
          {
            id: 'mastodonInstance',
            name: 'Mastodon Instance',
            type: 'url',
            description: 'For example: https://mastodon.social',
          },
          {
            id: 'mastodonUser',
            name: 'Mastodon Username',
            type: 'text',
            description: '@username',
          },
          {
            id: 'blueskyUserHandle',
            name: 'Bluesky User handle',
            type: 'text',
            description: '',
          },
          {
            id: 'blueskyAccessToken',
            name: 'Bluesky Token',
            type: 'password',
            description: 'You can get your token from https://bluesky.com/settings',
          },
        ],
      },
    ]

    return Response.json(workflowList)
  } catch (error) {
    console.log('[getWorkflows] Failed fetching data', error)
    return Response.json({ error: 'Failed fetching data' }, { status: 500 })
  }
}
