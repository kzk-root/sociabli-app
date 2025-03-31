import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import supabaseClient from './utils/SupabaseClient.mjs'
import { v4 } from 'uuid'
import FunctionEnvVars from './utils/FunctionEnvVars.mjs'

/**
 * Execute with request body
 *  - connectionFrom string the uuid for data source connection
 *  - connectionTo   string the uuid for data target connection
 *
 * Having a JWT token
 *  - userId         string the clerk user id
 *  - n8nApiKey      string the user n8n api key to create personal workflows
 *
 * @param request
 * @param _context
 */
export default async (request: Request, _context: Context) => {
  console.log('[createUserWorkflow] Start')
  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })

  if (retrievePrivateMetadataResult.success === false) {
    console.log(
      '[createUserWorkflow] Retrieve private metadata failed',
      retrievePrivateMetadataResult.error.error
    )

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  const userId = retrievePrivateMetadataResult.data.userId
  const requestBody = await request.json()

  // Check connectionFrom
  const connectionFrom = requestBody.connectionFrom

  if (!connectionFrom || typeof connectionFrom !== 'string' || connectionFrom.length === 0) {
    return Response.json(
      { message: `Invalid connectionFrom: "${JSON.stringify(connectionFrom)}"` },
      { status: 400 }
    )
  }

  const connectionFromResult = await supabaseClient
    .from('sociabli_connections')
    .select('*')
    .eq('id', connectionFrom)
    .throwOnError()

  if (connectionFromResult.data.length === 0) {
    return Response.json(
      { message: `ConnectionFrom "${connectionFrom}" not found` },
      { status: 404 }
    )
  }

  // Check connectionTo
  const connectionTo = requestBody.connectionTo

  if (!connectionTo || typeof connectionTo !== 'string' || connectionTo.length === 0) {
    return Response.json({ message: `Invalid connectionTo: "${connectionTo}"` }, { status: 400 })
  }

  const connectionToResult = await supabaseClient
    .from('sociabli_connections')
    .select('*')
    .eq('id', connectionTo)
    .throwOnError()

  if (connectionToResult.data.length === 0) {
    return Response.json({ message: `ConnectionTo "${connectionTo}" not found` }, { status: 404 })
  }

  // Determine workflow type
  const workflowType = `${connectionFromResult.data[0].connection_type}_to_${connectionToResult.data[0].connection_type}`
  if (workflowType !== 'mastodon_to_bluesky') {
    return Response.json(
      { message: `We do not support workflow type "${workflowType}" yet` },
      { status: 400 }
    )
  }

  // generate uuid for postgresql workflow
  const sociabliWorkflowId = v4()

  // create n8n workflow injecting new sociabli workflow id
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', FunctionEnvVars.n8nSecret)

  // Determine mastodon feed url
  const feedUrl = `https://${connectionFromResult.data[0].configuration.instanceHostname}/${connectionFromResult.data[0].configuration.userHandle}`

  const result = await fetch(`${FunctionEnvVars.n8nWebhookUrl}/activate-workflow-v2`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      userId: retrievePrivateMetadataResult.data.userId,
      n8nApiKey: retrievePrivateMetadataResult.data.n8nApiKey,
      workflowType: workflowType,
      sociabliWorkflowId: sociabliWorkflowId, // the postgresql workflow id from table sociabli_workflows (not the n8n workflow id)
      configuration: {
        mastodonFeedUrl: feedUrl,
      },
    }),
  })

  // handle failed n8n workflow creation
  if (!result.ok) {
    return Response.json(await result.json(), { status: result.status })
  }

  // extract n8n workflow id from result
  const n8nWorkflowId = (await result.json()).n8nWorkflowId

  // create sociabli workflow referencing n8n workflow id
  await supabaseClient
    .from('sociabli_workflows')
    .insert([
      {
        id: sociabliWorkflowId,
        user_id: userId,
        connection_from: connectionFrom,
        connection_to: connectionTo,
        n8n_workflow_id: n8nWorkflowId,
      },
    ])
    .throwOnError()

  return Response.json({}, { status: 200 })
}
