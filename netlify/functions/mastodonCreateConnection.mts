import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import supabaseClient from './utils/SupabaseClient.mjs'
import { Context } from '@netlify/functions'

export default async (request: Request, _context: Context) => {
  console.log('[MastodonCreateConnection] Start')

  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })
  const requestBody = await request.json()
  const instanceHostname = new URL(requestBody.mastodonInstance).hostname

  if (!/^https?:\/\/[^ "]+$/.test(requestBody.mastodonInstance)) {
    return Response.json(
      { message: `Invalid instance URL "${requestBody.mastodonInstance}" in request body` },
      { status: 400 }
    )
  }

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

  const userId = retrievePrivateMetadataResult.data.userId

  const mastodonInstanceData = await supabaseClient
    .from('sociabli_mastodon_instances')
    .select('*')
    .eq('instance_hostname', instanceHostname)
    .throwOnError()

  if (mastodonInstanceData.data.length === 0) {
    return Response.json({ message: 'Instance not found' }, { status: 404 })
  }

  const lookupUrl = `https://${instanceHostname}/api/v1/accounts/lookup?acct=${requestBody.mastodonUserHandle}`
  const tokenUrl = `https://${instanceHostname}/oauth/token`
  const tokenRequestData = {
    client_id: mastodonInstanceData.data[0].client_id,
    client_secret: mastodonInstanceData.data[0].client_secret,
    redirect_uri: `${FunctionEnvVars.mastodonAppRedirectUrl}`,
    grant_type: 'authorization_code',
    code: requestBody.code,
    scope: `${FunctionEnvVars.mastodonAppScopes}`,
  }

  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenRequestData),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.log(`[MastodonCreateConnection] Result of getMastodonToken`, tokenData)
      throw new Error(`Failed to get Mastodon access token.`)
    }

    const userIdResponse = await fetch(lookupUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const userDetails = await userIdResponse.json()

    if (!userIdResponse.ok) {
      console.log(`[MastodonCreateConnector] Result of getMastodonDetails`, userDetails)
      throw new Error(`Failed to get Mastodon user details.`)
    }

    await supabaseClient
      .from('sociabli_connections')
      .insert({
        user_id: userId,
        label: `${instanceHostname} - ${requestBody.mastodonUserHandle}`,
        configuration: {
          accessToken: tokenData.access_token,
          userId: userDetails.id,
          userHandle: requestBody.mastodonUserHandle,
          instanceHostname: instanceHostname,
        },
        connection_type: 'mastodon',
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
