import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import supabaseClient from './utils/SupabaseClient.mjs'

export default async (request: Request, _context: Context) => {
  console.log('[deleteUserConnections] Start')
  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if (retrievePrivateMetadataResult.success === false) {
    console.log(
      '[deleteUserConnections] Retrieve private metadata failed',
      retrievePrivateMetadataResult.error.error
    )

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  const userId = retrievePrivateMetadataResult.data.userId
  const requestBody = await request.json()
  const id = requestBody.id

  if (!id || typeof id !== 'string' || id.length === 0) {
    return Response.json({ message: 'Invalid id' }, { status: 400 })
  }

  const result = await supabaseClient
    .from('sociabli_connections')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (result.error) {
    console.log('[deleteUserConnections] Removal failed', result.error.message)

    return Response.json({ message: result.error.message }, { status: 500 })
  }

  return Response.json({}, { status: 200 })
}
