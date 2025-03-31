import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import supabaseClient from './utils/SupabaseClient.mjs'
import { Context } from '@netlify/functions'

/**
 * Create new connection to Bluesky.
 *
 * @param request
 * @param _context
 */
export default async (request: Request, _context: Context) => {
  console.log('[BlueskyCreateConnection] Start')

  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if (retrievePrivateMetadataResult.success === false) {
    console.log(
      '[MastodonCreateConnection] Get user failed',
      retrievePrivateMetadataResult.error.error
    )

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  const requestBody = await request.json()
  let blueskyUserHandle = requestBody.userHandle
  const appPassword = requestBody.appPassword

  if (
    !blueskyUserHandle ||
    typeof blueskyUserHandle !== 'string' ||
    !appPassword ||
    typeof appPassword !== 'string'
  ) {
    return Response.json({ message: 'Missing userHandle or appPassword' }, { status: 400 })
  }

  if (!blueskyUserHandle.startsWith('@')) {
    blueskyUserHandle = `@${blueskyUserHandle}`
  }

  const userId = retrievePrivateMetadataResult.data.userId

  try {
    const blueskyAuthUrl = 'https://bsky.social/xrpc/com.atproto.server.createSession'
    const blueskyAuthResponse = await fetch(blueskyAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: blueskyUserHandle.replace('@', ''), // this call has to be without user handle
        password: appPassword,
      }),
    })

    if (!blueskyAuthResponse.ok) {
      return Response.json({ message: 'Could not authenticate with Bluesky' }, { status: 400 })
    }

    await supabaseClient
      .from('sociabli_connections')
      .insert({
        user_id: userId,
        label: `Bluesky - ${blueskyUserHandle}`,
        configuration: {
          userId,
          userHandle: blueskyUserHandle,
          appPassword,
        },
        connection_type: 'bluesky',
      })
      .throwOnError()

    return Response.json({}, { status: 201 })
  } catch (e) {
    console.error('[MastodonCreateConnection] Error', e)

    if (e instanceof Error) {
      return Response.json({ message: e.message }, { status: 500 })
    }

    return Response.json({ message: JSON.stringify(e) }, { status: 500 })
  }
}
