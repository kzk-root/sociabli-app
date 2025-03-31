import supabaseClient from './SupabaseClient.mjs'
import FunctionEnvVars from './FunctionEnvVars.mjs'

type CleanupWorkflowArgs = {
  userId: string
  workflowId: string
  n8nApiKey: string
}

export default async ({ userId, workflowId, n8nApiKey }: CleanupWorkflowArgs) => {
  try {
    // first fetch workflow from postgres
    const workflowResult = await supabaseClient
      .from('sociabli_workflows')
      .select('*')
      .eq('id', workflowId)
      .throwOnError()

    // on missing flow in postgres, we can abort
    if (workflowResult.data.length === 0) {
      return Response.json({}, { status: 200 })
    }

    // if workflow is known, trigger deletion in N8N
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Authorization', FunctionEnvVars.n8nSecret)

    const url = `${FunctionEnvVars.n8nWebhookUrl}/remove-workflow`
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        workflowId: workflowResult.data[0].n8n_workflow_id,
        n8nApiKey: n8nApiKey,
        userId: userId,
      }),
    })

    if (!result.ok) {
      console.log('[deleteWorkflow] Failed to call N8N', result.statusText)
      return Response.json({ error: result.statusText, url }, { status: result.status })
    }

    // after N8N workflow deletion, we remove entry in postgres
    const deleteResult = await supabaseClient
      .from('sociabli_workflows')
      .delete()
      .eq('id', workflowId)
      .eq('user_id', userId)

    if (deleteResult.error) {
      console.log('[deleteUserWorkflow] Removal failed', deleteResult.error.message)

      return Response.json({ message: deleteResult.error.message }, { status: 500 })
    }

    return Response.json({}, { status: 200 })
  } catch (error) {
    console.log('[deleteWorkflow] Failed', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return Response.json({ error: `Failed deleting workflow: ${errorMessage}` }, { status: 500 })
  }
}
