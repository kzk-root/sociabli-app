import { Context } from '@netlify/functions'
import supabaseClient from './utils/SupabaseClient.mjs'
import { MastodonCreateInstance } from './utils/mastodonCreateInstance.mjs'
import FunctionEnvVars from './utils/FunctionEnvVars.mjs'

export default async (request: Request, _context: Context) => {
  console.log('[mastodonGetInstance] Start')

  const requestBody = await request.json()

  if (!requestBody || !requestBody.instance || typeof requestBody.instance !== 'string') {
    throw new Error(`Missing instance in request JSON body: "${requestBody}"`)
  }

  const instance = requestBody.instance as string

  if (!/^https?:\/\/[^ "]+$/.test(instance)) {
    throw new Error('Invalid instance URL')
  }

  const instanceHostname = new URL(instance).hostname

  const mastodonInstanceData = await supabaseClient
    .from('sociabli_mastodon_instances')
    .select('*')
    .eq('instance_hostname', instanceHostname)
    .throwOnError()

  if (mastodonInstanceData.data.length !== 0) {
    return Response.json({
      instanceHostname: instanceHostname,
      clientId: mastodonInstanceData.data[0].client_id,
      redirectUri: FunctionEnvVars.mastodonAppRedirectUrl,
      scope: FunctionEnvVars.mastodonAppScopes,
    })
  }

  const newMastodonInstance = await MastodonCreateInstance(instanceHostname)

  return Response.json({
    instanceHostname: instanceHostname,
    clientId: newMastodonInstance.clientId,
    redirectUri: FunctionEnvVars.mastodonAppRedirectUrl,
    scope: FunctionEnvVars.mastodonAppScopes,
  })
}
