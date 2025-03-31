import supabaseClient from './utils/SupabaseClient.mjs'
import { Context } from '@netlify/functions'
import FunctionEnvVars from './utils/FunctionEnvVars.mjs'

/**
 * Retrieve single workflow with its resolved connections. Used from within n8n execution.
 *
 * @param request
 * @param _context
 */
export default async (request: Request, _context: Context) => {
  console.log('[GetUserWorkflowConnections] Start')

  const requestBody = await request.json()
  const authHeader = request.headers.get('Authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    console.log('[GetUserWorkflowConnections] Missing token')
    return Response.json({ message: 'No token provided' }, { status: 401 })
  }

  if (FunctionEnvVars.n8nReceiveToken !== token) {
    console.log('[GetUserWorkflowConnections] Wrong token provided')
    return Response.json({ message: 'Wrong provided' }, { status: 401 })
  }

  const sociabliWorkflowId = requestBody.sociabliWorkflowId

  const mastodonInstanceData = await supabaseClient
    .from('sociabli_workflows')
    .select(
      `
      connection_from:sociabli_connections!sociabli_workflows_connection_from_fkey(id,configuration),
      connection_to:sociabli_connections!sociabli_workflows_connection_to_fkey(id,configuration)
    `
    )
    .eq('id', sociabliWorkflowId)
    .throwOnError()

  if (mastodonInstanceData.data.length === 0) {
    return Response.json({ message: 'Connections not found' }, { status: 404 })
  }

  try {
    return Response.json(mastodonInstanceData.data[0], { status: 201 })
  } catch (e) {
    console.error('[GetUserWorkflowConnections] Error', e)

    if (e instanceof Error) {
      return Response.json({ message: e.message }, { status: 500 })
    }

    return Response.json({ message: JSON.stringify(e) }, { status: 500 })
  }
}
