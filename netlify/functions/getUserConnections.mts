import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import supabaseClient from './utils/SupabaseClient.mjs'

export default async (request: Request, _context: Context) => {
  console.log('[getUserConnections] Start')
  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if (retrievePrivateMetadataResult.success === false) {
    console.log('[getUserConnections] Get failed', retrievePrivateMetadataResult.error.error)

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  const userId = retrievePrivateMetadataResult.data.userId

  const result = await supabaseClient
    .from('sociabli_connections')
    .select('id,label,connection_type')
    .eq('user_id', userId)

  if (result.error) {
    console.log('[getUserConnections] Get failed', result.error.message)

    return Response.json({ message: result.error.message }, { status: 500 })
  }

  return Response.json(result.data, { status: 200 })
}
