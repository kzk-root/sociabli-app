import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import cleanupWorkflow from './utils/cleanupWorkflow.mjs'

/**
 * Delete user workflow including N8N workflow referenced by postgres workflow.n8n_workflow_id.
 *
 * @param request
 * @param _context
 */
export default async (request: Request, _context: Context) => {
  console.log('[deleteWorkflow] Start')

  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })
  if (retrievePrivateMetadataResult.success === false) {
    console.log('[deleteWorkflow] Get failed', retrievePrivateMetadataResult.error.error)

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  const requestBody = await request.json()

  return cleanupWorkflow({
    userId: retrievePrivateMetadataResult.data.userId,
    workflowId: requestBody.workflowId,
    n8nApiKey: retrievePrivateMetadataResult.data.n8nApiKey,
  })
}
