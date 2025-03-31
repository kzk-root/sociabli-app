import { BskyAgent, RichText } from '@atproto/api'
import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'

/**
 * Retrieve facets for Bluesky posts - e.g. referenced from n8n Mastodon-to-Bluesky workflow.
 *
 * @param request
 */
export default async (request: Request) => {
  console.log('[blueskyFacetDetection] Start')

  try {
    const requestBody = await request.json()
    const authHeader = request.headers.get('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      console.log('[blueskyFacetDetection] Missing token')
      return Response.json({ message: 'No token provided' }, { status: 401 })
    }

    if (FunctionEnvVars.n8nReceiveToken !== token) {
      console.log('[blueskyFacetDetection] Wrong token provided')
      return Response.json({ message: 'Wrong provided' }, { status: 401 })
    }

    const blueskyAgent = new BskyAgent({ service: 'https://bsky.social' })
    const contentSnippet = requestBody.contentSnippet
    const richText = new RichText({ text: contentSnippet.replace(/\|\|/g, '\n') })
    await richText.detectFacets(blueskyAgent)

    return Response.json({
      text: richText.text.replace(/\n/g, '||'),
      facets: richText.facets || [],
    })
  } catch (error) {
    console.log('[blueskyFacetDetection] Failed', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return Response.json({ error: `Failed creating facets: ${errorMessage}` }, { status: 500 })
  }
}
