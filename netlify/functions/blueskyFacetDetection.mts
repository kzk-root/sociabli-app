import { BskyAgent, RichText } from '@atproto/api'

export default async (request: Request) => {
  try {
    const requestBody = await request.json()
    const authHeader = request.headers.get('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (process.env.CLERK_TOKEN !== token) {
      return Response.json({ message: 'No token provided' }, { status: 401 })
    }

    const blueskyAgent = new BskyAgent({ service: 'https://bsky.social' })

    const richText = new RichText({ text: requestBody.contentSnippet })
    await richText.detectFacets(blueskyAgent)

    return Response.json({
      text: richText.text,
      facets: richText.facets,
    })
  } catch (error) {
    console.log(error)
    return Response.json({ error: 'Failed creating facets' }, { status: 500 })
  }
}
