import { Context } from '@netlify/functions'
import { createClerkClient } from '@clerk/clerk-sdk-node'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_TOKEN })

export default async (request: Request, _context: Context) => {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return Response.json({ message: 'No token provided' }, { status: 401 })
  }

  try {
    await clerkClient.verifyToken(token)

    const workflowList = [
      { 'name' : 'Weblog to Medium', description: 'Each blog entry will be published on Medium', 'id': 'blog_to_medium', fields: [
          {id: 'mediumAccessToken', name:"Medium Token"},
        ]},
      { 'name' : 'Bluesky to Mastodon', description: 'Sync your Bluesky posts to Mastodon', 'id': 'bluesky_to_mastodon', fields: [
          {id: 'blueSkyAccessToken', name:"BlueSky Token", type: "password"},
          {id: 'mastodonAccessToken', name:"Mastodon Token", type: "password"},
        ]},
    ]

    return Response.json(workflowList)
  } catch (error) {
    return Response.json({ error: 'Failed fetching data' }, { status: 500 })
  }
}
