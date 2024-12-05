import { Context } from '@netlify/functions'
import retrievePrivateMetadata from './utils/retrievePrivateMetadata.mjs'
import FunctionEnvVars from 'netlify/functions/utils/FunctionEnvVars.mts'

export default async (request: Request, _context: Context) => {
  console.log('[activateWorkflow] Start')

  const retrievePrivateMetadataResult = await retrievePrivateMetadata({ request })
  if (retrievePrivateMetadataResult.success === false) {
    console.log('[activateWorkflow] Get failed', retrievePrivateMetadataResult.error.error)

    return Response.json(
      { message: retrievePrivateMetadataResult.error.message },
      { status: retrievePrivateMetadataResult.error.statusCode }
    )
  }

  try {
    // Call N8N - Sociabli with "data"
    // N8N Steps
    // Trigger on Webhook, receiving "data"
    // Create Credentials for Medium with n8n-api-key of user
    // Create Medium workflow with n8n-api-key of user
    // Extend Main Workflow with Medium Workflow
    //   - look up all user workflows and filter out Main Workflow
    //   - add new Medium Workflow to be triggered in Main Workflow

    const requestBody = await request.json()

    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Authorization', FunctionEnvVars.n8nSecret)

    const fields = requestBody.fields.reduce(
      (acc: Record<string, string>, field: { id: string; value: string }) => {
        return {
          ...acc,
          [field.id]: field.value,
        }
      },
      {}
    )

    const result = await fetch(`${FunctionEnvVars.n8nWebhookUrl}/activate-workflow`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId: retrievePrivateMetadataResult.data.userId,
        n8nApiKey: retrievePrivateMetadataResult.data.n8nApiKey,
        n8nMainWorkflowId: retrievePrivateMetadataResult.data.n8nMainWorkflowId,
        workflowId: requestBody.workflowId,
        fields,
      }),
    })

    if (!result.ok) {
      return Response.json(await result.json(), { status: result.status })
    }

    return Response.json({}, { status: 200 })
  } catch (error) {
    console.log('[activateWorkflow] Error thrown', error)
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
    return Response.json({ error: `Failed activating workflow: ${errorMessage}` }, { status: 500 })
  }
}
