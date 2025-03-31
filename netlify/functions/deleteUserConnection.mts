import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import supabaseClient from './utils/SupabaseClient.mjs'
import cleanupWorkflow from './utils/cleanupWorkflow.mjs'

/**
 * Delete user connection.
 *
 * @param request
 * @param _context
 */
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

  // Retrieve workflows related with given connection
  const workflowResult = await supabaseClient
    .from('sociabli_workflows')
    .select('*')
    .eq('user_id', userId)
    .or(`connection_from.eq.${id}, connection_to.eq.${id}`)
    .throwOnError()

  if (workflowResult.data.length !== 0) {
    console.log(
      `[deleteUserConnections] We need to remove ${workflowResult.data.length} related workflows`
    )

    for await (const workflow of workflowResult.data) {
      console.log(`[deleteUserConnections] Cleaning up for "${workflow.id}"`)

      const result = await cleanupWorkflow({
        userId: userId,
        workflowId: workflow.id,
        n8nApiKey: retrievePrivateMetadataResult.data.n8nApiKey,
      })

      console.log(`[deleteUserConnections] Cleaned up: "${result.ok}/${result.status}"`)
    }
  } else {
    console.log(`[deleteUserConnections] No related workflows to be deleted - continue`)
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
