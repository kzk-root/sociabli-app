import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'
import supabaseClient from './SupabaseClient.mts'

export const MastodonCreateInstance = async (instanceHostname: string) => {
  const data = {
    client_name: 'Sociabli',
    redirect_uris: `${FunctionEnvVars.mastodonAppRedirectUrl}`, // HINT: use this to show the code instead of redirecting the user 'urn:ietf:wg:oauth:2.0:oob',
    scopes: `${FunctionEnvVars.mastodonAppScopes}`,
    website: 'https://sociab.li',
  }
  const mastodonAppResponse = await fetch(`https://${instanceHostname}/api/v1/apps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!mastodonAppResponse.ok) {
    throw new Error(
      `Could not create Mastodon app for instance "${instanceHostname}" with status code ${mastodonAppResponse.status}`
    )
  }

  const responseBody = await mastodonAppResponse.json()

  if (!responseBody) {
    throw new Error(
      `Could not create Mastodon app for instance "${instanceHostname}" – no response body`
    )
  }

  if (!responseBody.client_id || !responseBody.client_secret) {
    throw new Error(
      `Could not create Mastodon app for instance "${instanceHostname}" – missing client_id or client_secret: ${responseBody}`
    )
  }

  await supabaseClient
    .from('sociabli_mastodon_instances')
    .insert({
      instance_hostname: instanceHostname,
      client_id: responseBody.client_id,
      client_secret: responseBody.client_secret,
    })
    .throwOnError()

  return {
    instanceHostname: instanceHostname,
    clientId: responseBody.client_id,
    redirectUri: FunctionEnvVars.mastodonAppRedirectUrl,
    scope: FunctionEnvVars.mastodonAppScopes,
  }
}
